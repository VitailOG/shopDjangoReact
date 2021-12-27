from rest_framework import serializers

from shop.serializers import CartSerializers
from .models import Order


class WrongProductsSerializers(serializers.Serializer):
    title = serializers.CharField()
    cartProduct = serializers.IntegerField()
    countOnStock = serializers.IntegerField()
    id = serializers.IntegerField()


class OrderSerializers(serializers.ModelSerializer):

    cart = CartSerializers()

    class Meta:
        model = Order
        fields = (
          'id',
          'order_date',
          'first_name',
          'last_name',
          'phone',
          'address',
          'type_delivery',
          'cart', 
          'price_with_promo_code', 
        )
