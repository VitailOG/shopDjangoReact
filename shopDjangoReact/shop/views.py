from django.http.response import JsonResponse
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated

from .models import (Category,
                     Cart,
                     Product,
                     CartProduct,
                     Review,
                     SpecificationProduct,
                     Reminder,
                     ProductInPending
                     )
from .pagination import CategoryProductsPagination
from .serializers import (CategorySerializers,
                          CartSerializers,
                          ProductListSerializers,
                          ReviewSerializers,
                          ProductDetailSerializers,
                          SpecificationSerializers,
                          InPendingSerializers,
                          ProductWithoutCategorySerializers
                          )
from .services.cart import (add_product_to_cart,
                            delete_product_from_cart,
                            change_count_product_in_cart,
                            get_customer_cart,
                            get_only_present_products_on_stock,
                            delete_product_not_in_pending
                            )
from .services.product import check_product_in_cart, create_rating
from .filters import ProductFilter


@method_decorator(cache_page(60 * 5), name='dispatch')
class CategoryAPI(ModelViewSet):
    """ API for categories products
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializers


class CartAPI(ModelViewSet):
    """ API for cart
    """
    queryset = Cart.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = CartSerializers

    @action(methods=['get'], detail=False)
    def get_current_cart_customer(self, *args, **kwargs):
        current_cart = get_only_present_products_on_stock(get_customer_cart(self.request.user))
        data = CartSerializers(current_cart).data
        return Response(data)

    @action(methods=['post'], detail=False, url_path='add-to-cart/(?P<pk>\d+)')
    def add_to_cart(self, *args, **kwargs):
        product = Product.objects.filter(id=self.kwargs.get('pk')).first()
        cart = get_customer_cart(self.request.user)
        cart_product = add_product_to_cart(cart, product)
        if cart_product:
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], detail=False, url_path='delete-from-cart/(?P<pk>\d+)')
    def delete_from_cart(self, *args, **kwargs):
        cart_product = CartProduct.objects.filter(pk=self.kwargs.get('pk')).first()
        cart = get_customer_cart(self.request.user)
        delete_product_from_cart(cart, cart_product)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['patch'], detail=False, url_path='change-count-cart-product/(?P<cp>\d+)/(?P<count>\d+)')
    def change_count_cart_product(self, *args, **kwargs):
        count = self.kwargs.get('count')
        cart_product = CartProduct.objects.filter(id=self.kwargs.get('cp'))
        if int(count) > cart_product.first().product.count_on_stock:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        change_count_product_in_cart(cart_product, count)
        return Response(status=status.HTTP_200_OK)


class ProductAPI(ModelViewSet):
    """ API for product
    """
    serializer_class = ProductListSerializers
    queryset = Product._base_manager
    lookup_field = 'slug'

    @staticmethod
    def check_exists_product_in_cart(user, data):
        if user.is_authenticated:
            id_product = check_product_in_cart(user)
            for product in data:
                product['in_cart'] = product['id'] in id_product

    @action(['get'], detail=False, url_path='home')
    def products_on_home_page(self, *args, **kwargs):
        products = Product.objects.get_four_new_product().select_related('category')
        data = ProductListSerializers(products, many=True).data
        if self.request.user.is_authenticated:
            self.check_exists_product_in_cart(self.request.user, data)
        return Response(data)

    @action(['get'], detail=False, url_path='category/(?P<c>\S+)')
    def category_products(self, *args, **kwargs):
        self.filter_backends = [OrderingFilter, DjangoFilterBackend]
        self.pagination_class = CategoryProductsPagination
        self.filterset_class = ProductFilter
        self.ordering_fields = ['id', 'price']
        query_params = self.request.query_params.get('specification__value_spec')

        products = Product._base_manager.filter(category__slug=self.kwargs.get('c')) \
            .select_related('category')

        if query_params:
            products = products.filter(specification__value_spec__in=query_params.split("&")).distinct()

        queryset = self.filter_queryset(products)
        pagination_queryset = self.paginate_queryset(queryset)
        data = ProductListSerializers(pagination_queryset, many=True).data
        if self.request.user.is_authenticated:
            self.check_exists_product_in_cart(self.request.user, data)
        return self.get_paginated_response(data)

    # @action(['get'], detail=False, url_path='detail/(?P<slug_product>\S+)')
    # def product_detail(self, *args, **kwargs):
    #     product = Product.objects.select_related('category')\
    #         .filter(slug=self.kwargs.get("slug_product")).first()
    #     data = ProductDetailSerializers(product, context=self.get_serializer_context()).data
    #     return Response(data)

    def retrieve(self, request, slug=None):
        product = Product.objects.select_related('category')\
            .filter(slug=slug).first()
        data = ProductDetailSerializers(product, context=self.get_serializer_context()).data
        return Response(data)

    @action(['post'], detail=False, url_path='create-rating/(?P<id_product>\d+)/(?P<value>\d+)')
    def create_or_update_rating_for_product(self, *args, **kwargs):
        created = create_rating(self.request, self.kwargs.get('id_product'), self.kwargs.get('value'))
        if created:
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewAPI(ModelViewSet):
    """ API for reviews customers
    """
    queryset = Review.objects
    serializer_class = ReviewSerializers

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(['get'], detail=False, url_path='(?P<slug_product>\S+)')
    def comment(self, *args, **kwargs):
        product_review = Review.objects.prefetch_related('children__customer')\
            .select_related('customer').filter(product__slug=self.kwargs.get('slug_product'))
        data = ReviewSerializers(product_review, many=True).data
        return Response(data)


class InPendingAPI(ModelViewSet):
    """ API for ProductInPending model
    """
    queryset = ProductInPending.objects.prefetch_related('product').all()
    serializer_class = InPendingSerializers
    permission_classes = [IsAuthenticated]

    @staticmethod
    def product(product_slug):
        return Product.objects.filter(slug=product_slug).first()

    @staticmethod
    def in_pending(user):
        return ProductInPending.objects.filter(customer=user).first()

    @action(methods=['get'], detail=False)
    def get_products_in_pending_customer(self, *args, **kwargs):
        in_pending = ProductInPending.objects\
            .select_related('customer')\
            .prefetch_related('product')\
            .filter(customer=self.request.user).first()
        data = InPendingSerializers(delete_product_not_in_pending(in_pending)).data
        return Response(data)

    @action(methods=['post'], detail=False, url_path='product-in-pending/(?P<c>\S+)')
    def add_product_in_pending(self, *args, **kwargs):
        self.in_pending(self.request.user).product.add(self.product(self.kwargs.get('c')))
        return Response(status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=False, url_path='delete/(?P<c>\S+)')
    def remove_from_pending(self, *args, **kwargs):
        self.in_pending(self.request.user).product.remove(self.product(self.kwargs.get('c')))
        return Response(status=status.HTTP_204_NO_CONTENT)


@method_decorator(cache_page(60 * 2), name='dispatch')
class SpecificationValueAPI(ReadOnlyModelViewSet):
    """ API for specifications product separate category
    """
    serializer_class = SpecificationSerializers
    queryset = SpecificationProduct.objects

    # @method_decorator(cache_page(60 * 60 * 2))
    @action(['get'], detail=False, url_path='(?P<slug>\S+)')
    def specification_value(self, *args, **kwargs):
        print(1)
        list_unique_specification = SpecificationProduct.objects\
            .filter(product__category__slug=self.kwargs.get('slug'))\
            .values('name_spec', 'value_spec').distinct()
        data = SpecificationSerializers(list_unique_specification, many=True).data
        return Response(data)

    # @method_decorator(cache_page(60*60*2))
    @action(['get'], detail=False, url_path='name/(?P<slug>\S+)')
    def get_products_name(self, *args, **kwargs):
        products = Product.objects.filter(category__slug=self.kwargs.get('slug'))
        data = ProductWithoutCategorySerializers(products, many=True).data
        return Response(data)


class ReminderAPI(ReadOnlyModelViewSet):
    """ Api for reminder customers
    """

    queryset = Reminder.objects

    @action(['get'], detail=False)
    def show_reminder_for_customer(self, *args, **kwargs):
        if self.request.user.is_authenticated:
            reminder_count = Reminder.objects.filter(customer=self.request.user, is_read=False).count()
            return JsonResponse({'reminder_count': reminder_count})
        return Response({"reminder_count": 0})

    @action(['post'], detail=False)
    def view_all_products(self, *args, **kwargs):
        if self.request.user.is_authenticated:
            Reminder.objects.filter(customer=self.request.user).update(is_read=True)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)
