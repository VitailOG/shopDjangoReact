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
from .services.cart import (
                            BaseCartService,
                            AddProductToCartService, 
                            DeleteProductFromCart,
                            ChangeCountProductInCart
                            )
from .services.product import create_rating
from .services.pending import PendingSevice
from .filters import ProductFilter
from .utils import check_exists_product_in_cart


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
        current_cart = BaseCartService().get_only_present_products_on_stock(self.request.user)
        data = CartSerializers(current_cart).data
        return Response(data)

    @action(methods=['post'], detail=False, url_path='add-to-cart/(?P<pk>\d+)')
    def add_to_cart(self, *args, **kwargs):
        cart_product = AddProductToCartService(self.request.user, self.kwargs.get('pk'))()
        if cart_product:
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], detail=False, url_path='delete-from-cart/(?P<pk>\d+)')
    def delete_from_cart(self, *args, **kwargs):
        DeleteProductFromCart(self.request.user, self.kwargs.get('pk'))()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['patch'], detail=False, url_path='change-count-cart-product/(?P<cp>\d+)/(?P<count>\d+)')
    def change_count_cart_product(self, *args, **kwargs):
        change_count_product_in_cart = ChangeCountProductInCart(self.request.user, self.kwargs.get('cp'), self.kwargs.get('count'))()
        if not change_count_product_in_cart:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


class ProductAPI(ModelViewSet):
    """ API for product
    """
    serializer_class = ProductListSerializers
    queryset = Product._base_manager
    lookup_field = 'slug'
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    pagination_class = CategoryProductsPagination
    filterset_class = ProductFilter
    ordering_fields = ['id', 'price']

    @action(['get'], detail=False, url_path='home')
    def products_on_home_page(self, *args, **kwargs):
        products = Product.objects.get_four_new_product()
        data = ProductListSerializers(products, many=True).data
        if self.request.user.is_authenticated:
            check_exists_product_in_cart(self.request.user, data)
        return Response(data)

    @action(['get'], detail=False, url_path='category/(?P<c>\S+)')
    def category_products(self, *args, **kwargs):
        products = Product._base_manager.filter(category__slug=self.kwargs.get('c')) \
            .select_related('category')
        queryset = self.filter_queryset(products)
        pagination_queryset = self.paginate_queryset(queryset)
        data = ProductListSerializers(pagination_queryset, many=True).data
        if self.request.user.is_authenticated:
            check_exists_product_in_cart(self.request.user, data)
        return self.get_paginated_response(data)

    def retrieve(self, request, slug=None):
        product = Product.objects.select_related('category')\
            .filter(slug=slug).first()
        data = ProductDetailSerializers(product, context=self.get_serializer_context()).data
        return Response(data)

    @action(['post'], detail=False, url_path='create-rating/(?P<id_product>\d+)')
    def create_or_update_rating_for_product(self, *args, **kwargs):
        value = self.request.data.get('value')
        created = create_rating(self.request, self.kwargs.get('id_product'), value)
        if created:
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewAPI(ModelViewSet):
    """ API for reviews customers
    """
    queryset = Review.objects
    serializer_class = ReviewSerializers

    @action(['get'], detail=False, url_path='(?P<product_id>\d+)')
    def comment(self, *args, **kwargs):
        product_review = Review.objects.prefetch_related('children__customer')\
            .select_related('customer').filter(product__id=self.kwargs.get('product_id'))
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
        return Product.objects.get_product_by_slug(slug=product_slug)

    @staticmethod
    def in_pending(user):
        return ProductInPending.objects.filter(customer=user).first()

    @action(methods=['get'], detail=False)
    def get_products_in_pending_customer(self, *args, **kwargs):
        products_in_pending = ProductInPending.objects.get_products_in_pending(self.request.user)
        correct_data = PendingSevice().correct_products_on_pending(products_in_pending)
        data = InPendingSerializers(correct_data).data
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

    @action(['get'], detail=False, url_path='(?P<slug>\S+)')
    def specification_value(self, *args, **kwargs):
        list_unique_specification = SpecificationProduct.objects.get_unique_specifications(self.kwargs.get('slug'))
        data = SpecificationSerializers(list_unique_specification, many=True).data
        return Response(data)

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
            reminder_count = Reminder.objects.reminder_count(self.request.user)
            return JsonResponse({'reminder_count': reminder_count})
        return Response({"reminder_count": 0})

    @action(['post'], detail=False)
    def view_all_products(self, *args, **kwargs):
        if self.request.user.is_authenticated:
            Reminder.objects.read_all(customer=self.request.user)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)
