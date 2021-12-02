# from decimal import Decimal

# from django.urls import reverse

# from rest_framework.test import APITestCase, APIRequestFactory
# from rest_framework import status

# from customer.models import Customer
# from ..models import Category, Product, CartProduct, Cart
# from ..serializers import ProductListSerializers
# from ..views import ReviewAPI


# class ShopTest(APITestCase):

#     def setUp(self) -> None:
#         self.category = Category.objects.create(name='name1', slug='slug1')
#         self.user = Customer.objects.create(username="user1", password="1111")
#         self.cart = Cart.objects.create(customer=self.user)
#         self.product = Product.objects.create(category=self.category,
#                                               title="title",
#                                               slug="title",
#                                               price=Decimal("1000.00")
#                                               )
#         product2 = Product.objects.create(category=self.category,
#                                           title="title",
#                                           slug="title",
#                                           count_on_stock=5,
#                                           price=Decimal("1000.00")
#                                           )
#         self.cart_product = CartProduct.objects.create(cart=self.cart,
#                                                        product=product2
#                                                        )

#         self.category_list = reverse('category-list')
#         self.category_detail = reverse('category-detail', args=(self.category.id,))
#         self.current_customer_cart = reverse('cart-get-current-cart-customer')
#         self.add_product_to_cart = reverse('cart-add-to-cart', args=(self.product.id,))
#         self.delete_product_from_cart = reverse('cart-delete-from-cart', args=(self.cart_product.id,))
#         self.change_count_product_in_cart = reverse('cart-change-count-cart-product', args=(self.cart_product.id, 3))
#         self.incorrect_change_count_product_in_cart = reverse('cart-change-count-cart-product',
#                                                               args=(self.cart_product.id, 6))
#         self.home_page = reverse('product-list')
#         self.category_products = f'/shop/product/category/{self.category.slug}/'
#         self.reviews = reverse('review-list')
#         self.in_pending = '/shop/in-pending/get_products_in_pending_customer/'

#     def test_list_category(self):
#         response = self.client.get(self.category_list)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_category_detail(self):
#         response = self.client.get(self.category_detail)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_get_current_customer_cart(self):
#         self.client.force_login(self.user)
#         response = self.client.get(self.current_customer_cart)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_add_product_to_cart(self):
#         self.client.force_login(self.user)
#         self.assertEqual(self.cart.products.count(), 0)
#         response = self.client.post(self.add_product_to_cart)
#         self.assertEqual(self.cart.products.count(), 1)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_delete_product_from_cart(self):
#         self.client.force_login(self.user)
#         response = self.client.post(self.delete_product_from_cart)
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

#     def test_correct_change_count_product_in_cart(self):
#         self.client.force_login(self.user)
#         response = self.client.patch(self.change_count_product_in_cart)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_incorrect_change_count_product_in_cart(self):
#         self.client.force_login(self.user)
#         response = self.client.patch(self.incorrect_change_count_product_in_cart)
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

#     def test_get_home_page(self):
#         response = self.client.get(self.home_page)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_category_products(self):
#         response = self.client.get(self.category_products)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_filter_product(self):# pagination must be more 1
#         category = Category.objects.create(name='name2', slug='slug2')
#         product1 = Product.objects.create(category=category,
#                                           title="title 1",
#                                           slug="title1",
#                                           price=Decimal("1000.00")
#                                           )
#         product2 = Product.objects.create(category=category,
#                                           title="title 2",
#                                           slug="title2",
#                                           price=Decimal("1000.00")
#                                           )
#         product3 = Product.objects.create(category=category,
#                                           title="qwerty",
#                                           slug="title3",
#                                           price=Decimal("1500.00")
#                                           )
#         response = self.client.get(f'/shop/product/category/{category.slug}/', data={"title": "title"})
#         filter_data = ProductListSerializers([product1, product2], many=True).data
#         self.assertEqual(response.data['results'], filter_data)
#         self.assertEqual(len(response.data['results']), 2)

#     def test_reviews(self):
#         response = self.client.get(self.reviews)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_create_review(self):
#         factory = APIRequestFactory()
#         request = factory.post(self.reviews, {
#             "review": "text",
#             "product": self.product.id,
#             "parent": ""
#         })
#         request.user = self.user
#         response = ReviewAPI.as_view({'post': 'create'})(request)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_in_pending(self):
#         self.client.force_login(self.user)
#         res = self.client.get(self.in_pending)
#         self.assertEqual(res.status_code, status.HTTP_200_OK)

