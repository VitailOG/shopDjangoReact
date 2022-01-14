import datetime

from django.db.models import Sum, Count, Q
from django.utils import timezone
from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField,
    Serializer,
    ListSerializer,
    SlugRelatedField,
    IntegerField,
    FloatField
)

from .models import (
    Category,
    Product,
    CartProduct,
    Cart,
    ShortImgProduct,
    Review,
    ProductInPending,
    SpecificationProduct,
    RatingProduct
)
from customer.models import Customer
from .utils import get_client_ip


class CategorySerializers(ModelSerializer):
    """ For Category model
    """
    class Meta:
        model = Category
        fields = "__all__"


class FilterReviewListSerializer(ListSerializer):
    """Фильтр відгуків, тільки parents"""
    def to_representation(self, data):
        data = data.filter(parent=None)
        return super().to_representation(data)


class RecursiveSerializer(Serializer):
    """Рекурсивно children"""
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class ReviewSerializers(ModelSerializer):
    """ For Review model
    """
    customer = SlugRelatedField(slug_field='username', read_only=True)
    children = RecursiveSerializer(many=True, required=False)
    formated_date = SerializerMethodField()

    class Meta:
        list_serializer_class = FilterReviewListSerializer
        model = Review
        fields = (
            'id',
            'review',
            'customer',
            'product',
            'children',
            'parent',
            'formated_date'
        )
        
    def get_formated_date(self, obj) -> str:
        return obj.date.strftime('%m/%d/%Y, %H:%M:%S')


class SpecificationSerializers(ModelSerializer):
    """ For SpecificationProduct model
    """
    class Meta:
        model = SpecificationProduct
        fields = (
            'name_spec',
            'value_spec'
        )


class ShortImgProductSerializers(ModelSerializer):
    """ For ShortImgProduct model
    """
    class Meta:
        model = ShortImgProduct
        fields = ('img',)


class ProductRatingSerializers(Serializer):
    count = IntegerField()
    all_rating = FloatField()
    user_exists_rating = FloatField()


class ProductDetailSerializers(ModelSerializer):
    """ For Product model(detail)
    """
    category = CategorySerializers()
    specification = SpecificationSerializers(many=True)
    product_image = ShortImgProductSerializers(many=True)

    in_cart = SerializerMethodField()
    rating_value = SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id',
            'category',
            'title',
            'slug',
            'price',
            'main_img',
            'product_image',
            'specification',
            'in_cart',
            'rating_value',
            'count_on_stock',
        )

    def get_in_cart(self, obj) -> bool:
        if self.context.get('request', None):

            request = self.context.get('request', None)
            user = getattr(request, 'user')

            user_or_none = user if user.is_authenticated else None
            user_ip = get_client_ip(request)

            cart = Cart.objects.get_cart_by_customer_or_ip(user_or_none, user_ip)

            if cart and cart.products.filter(product=obj).exists():
                return True
            return False
    
    def get_rating_value(self, obj) -> dict:
        user = get_client_ip(self.context.get('request', None))

        agg_value = RatingProduct.objects.filter(product=obj).aggregate(Sum('value'), Count('id'))
        amount, count = agg_value['value__sum'], agg_value['id__count']
        user_exists_rating = RatingProduct.objects.filter(ip_address_user=user, product=obj)

        data = {
            "count": count,
            "all_rating": 0 if amount is None else amount,
            "user_exists_rating": 0 if not user_exists_rating else getattr(user_exists_rating.first(), 'value')
        }

        res = ProductRatingSerializers(data).data
        return res


class ProductListSerializers(ModelSerializer):
    """ For Product model(list)
    """
    category = CategorySerializers()
    new_product = SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id',
            'category',
            'title',
            'slug',
            'price',
            'main_img',
            'count_on_stock',
            'new_product',
        )

    def get_new_product(self, obj) -> bool:
        return obj.date >= (timezone.now() - datetime.timedelta(days=1))


class CustomerSerializers(ModelSerializer):
    """ For Customer model
    """
    class Meta:
        model = Customer
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "customer_phone",
            "customer_order"
        )


class ProductWithoutCategorySerializers(ModelSerializer):

    class Meta:
        model = Product
        fields = (
            'id',
            'title',
            'price',
            'main_img',
            'count_on_stock',
            'slug'
        )


class CartProductSerializers(ModelSerializer):
    """ For CartProduct model
    """
    product = ProductWithoutCategorySerializers()

    class Meta:
        model = CartProduct
        fields = "__all__"


class CartSerializers(ModelSerializer):
    """ For Cart model
    """
    products = CartProductSerializers(many=True)

    class Meta:
        model = Cart
        fields = "__all__"


class InPendingSerializers(ModelSerializer):

    product = ProductWithoutCategorySerializers(many=True)

    class Meta:
        model = ProductInPending
        fields = "__all__"
