from collections import OrderedDict
from pprint import pprint

from django.utils import timezone
from rest_framework.test import APITestCase

from customer.models import Customer
from shop.models import Cart
from shop.serializers import CartSerializers, CustomerSerializers

from ..models import Order
from ..serializers import OrderSerializers


class APIViewTests(APITestCase):

    def setUp(self) -> None:
        self.user = Customer.objects.create(username="user1", password="1111")
        self.cart = Cart.objects.create(customer=self.user)
        self.order = Order.objects.create(customer=self.user,
                                          first_name='user',
                                          last_name='user',
                                          phone='4563654',
                                          address='address',
                                          type_delivery='type',
                                          order_date='2021-08-26',
                                          cart=self.cart
                                          )

    def test_order(self):
        order = OrderSerializers(self.order).data
        cart = CartSerializers(self.cart).data
        correct_data = {
            'address': self.order.address,
            'cart': cart,
            'customer': self.user.id,
            'first_name': self.order.first_name,
            'id': self.order.id,
            'last_name': self.order.last_name,
            'phone': self.order.phone,
            'order_date': self.order.order_date,
            'type_delivery': self.order.type_delivery
        }
        self.assertEqual(order, correct_data)
