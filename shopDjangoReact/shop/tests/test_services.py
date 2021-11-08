from decimal import Decimal

from rest_framework.test import APITestCase

from ..models import Category
from ..services.cart import *


class ServicesTest(APITestCase):

    def setUp(self) -> None:
        self.category = Category.objects.create(name='name1', slug='slug1')
        self.user = Customer.objects.create(username="test", email="email@gmail.com", password="1111")
        self.user1 = Customer.objects.create(username="test1", email="email1@gmail.com", password="1111")
        self.user2 = Customer.objects.create(username="test2", email="email2@gmail.com", password="1111")
        self.test_cart = Cart.objects.create(customer=self.user1)
        self.test2_cart = Cart.objects.create(customer=self.user2)
        self.product1 = Product.objects.create(category=self.category,
                                               title="title 1",
                                               slug="title1",
                                               price=Decimal("1000.00")
                                               )
        self.product2 = Product.objects.create(category=self.category,
                                               title="title 2",
                                               slug="title2",
                                               price=Decimal("1000.00")
                                               )
        self.product3 = Product.objects.create(category=self.category,
                                               title="qwerty",
                                               slug="title3",
                                               price=Decimal("1000.00")
                                               )
        self.product4 = Product.objects.create(category=self.category,
                                               title="qwerty1",
                                               slug="title4",
                                               price=Decimal("1000.00")
                                               )

    def test_create_cart(self):
        cart_customer = Cart.objects.filter(customer=self.user).first()
        self.assertIsNone(cart_customer)
        results = get_customer_cart(self.user)
        cart_customer = Cart.objects.filter(customer=self.user).first()
        self.assertTrue(cart_customer)
        self.assertIsInstance(results, Cart)

    def test_create_cart_product(self):
        results = create_cart_product(self.test_cart, self.product1)
        self.assertIsInstance(results[0], CartProduct)
        self.assertEqual(results[0].product.title, self.product1.title)

    def test_add_product_to_cart(self):
        self.assertEqual(self.test_cart.products.count(), 0)
        results_true = add_product_to_cart(self.test_cart, self.product1)
        self.assertEqual(self.test_cart.products.count(), 1)
        results_false = add_product_to_cart(self.test_cart, self.product1)
        self.assertEqual(self.test_cart.products.count(), 1)
        self.assertTrue(results_true)
        self.assertFalse(results_false)

    def test_remove_product_from_cart(self):
        add_product_to_cart(self.test2_cart, self.product1)
        self.assertEqual(self.test2_cart.products.count(), 1)
        cart_product = create_cart_product(self.test2_cart, self.product1)
        delete_product_from_cart(self.test2_cart, cart_product[0])
        self.assertEqual(self.test2_cart.products.count(), 0)

    def test_method_save_cart_without_discount(self):
        add_product_to_cart(self.test2_cart, self.product1)
        add_product_to_cart(self.test2_cart, self.product2)
        self.assertEqual(self.test2_cart.all_product, 2)
        self.assertEqual(self.test2_cart.discount, 0)
        self.assertEqual(self.test2_cart.all_price, 2000)

    def test_method_save_cart_with_discount(self):
        add_product_to_cart(self.test2_cart, self.product1)
        add_product_to_cart(self.test2_cart, self.product2)
        add_product_to_cart(self.test2_cart, self.product3)
        self.assertEqual(self.test2_cart.all_product, 3)
        self.assertEqual(self.test2_cart.discount, 2850)
        self.assertEqual(self.test2_cart.all_price, 0)
