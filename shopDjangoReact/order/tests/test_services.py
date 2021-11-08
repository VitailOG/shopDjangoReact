from django.utils import timezone
from rest_framework.test import APITestCase

from customer.models import Customer
from shop.models import Cart
from ..models import Order
from ..services.order import create_order


class OrderServicesTest(APITestCase):

    def setUp(self) -> None:
        self.user = Customer.objects.create(username="test", password="1111")
        self.test_cart = Cart.objects.create(customer=self.user)

    def test_create_order(self):
        self.assertEqual(Order.objects.count(), 0)
        create_order(self.user, self.test_cart, **{'first_name': 'first_name',
                                                   'last_name': 'last_name',
                                                   'phone': 'phone',
                                                   'address': 'address',
                                                   'type_delivery': 'type_delivery',
                                                   'date': timezone.now()
                                                   })
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(Order.objects.first().customer, self.user)
