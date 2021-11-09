from rest_framework.serializers import ModelSerializer

from shop.serializers import CartSerializers
from .models import Order


class OrderSerializers(ModelSerializer):

    cart = CartSerializers()

    class Meta:
        model = Order
        fields = ('id',
                  'customer',
                  'order_date',
                  'first_name',
                  'last_name',
                  'phone',
                  'address',
                  'type_delivery',
                  'cart', 
                  'price_with_promo_code', 
                  'promo_code'
                )
