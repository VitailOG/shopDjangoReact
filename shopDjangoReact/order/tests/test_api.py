from django.urls import reverse
from django.utils import timezone

from rest_framework.test import APITestCase, APIRequestFactory
from rest_framework import status

from customer.models import Customer
from shop.models import Cart
from ..views import OrderAPI


class OrderTest(APITestCase):

    def setUp(self) -> None:
        self.user = Customer.objects.create(username="user1", email="email@gmail.com", password="1111")
        self.cart = Cart.objects.create(customer=self.user)

        self.orders = reverse('order-list')
        self.make_order = '/order/make-order/order/'

    def test_get_orders(self):
        response = self.client.get(self.orders)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_make_order(self):
    #     factory = APIRequestFactory()
    #     request = factory.post(self.make_order, {
    #         "first_name": "vitalik",
    #         "last_name": "zakharkiv",
    #         "phone": "+48951565468414",
    #         "address": "Адрес",
    #         "type_delivery": "Самовивоз",
    #         "date": "2021-08-27"
    #     })
    #     request.user = self.user
    #     self.assertEqual(request.POST['first_name'], 'vitalik')
    #     self.assertEqual(request.user, self.user)
    #     response = OrderAPI.as_view({'post': 'order'})(request)
    #     print(response.status_code)
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
