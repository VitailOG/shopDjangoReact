from pprint import pprint
from collections import OrderedDict
from decimal import Decimal

from rest_framework.test import APITestCase

from customer.models import Customer
from ..models import (Category,
                      Product,
                      Cart,
                      CartProduct,
                      ShortImgProduct,
                      Review,
                      SpecificationProduct
                      )
from ..serializers import (CategorySerializers,
                           ProductListSerializers,
                           CartProductSerializers,
                           ProductDetailSerializers,
                           ReviewSerializers,
                           ProductWithoutCategorySerializers,
                           SpecificationSerializers,
                           ShortImgProductSerializers
                           )


class APIViewTests(APITestCase):

    def setUp(self) -> None:
        self.category = Category.objects.create(name='name', slug='slug')
        self.category1 = Category.objects.create(name='name2', slug='slug2')
        self.category2 = Category.objects.create(name='name3', slug='slug3')

        self.user = Customer.objects.create(username="user1", password="1111")
        self.cart = Cart.objects.create(customer=self.user)
        self.product_for_cart = Product.objects.create(category=self.category,
                                                       title="title",
                                                       slug="title",
                                                       main_img='k6-black-__7_1.jpg',
                                                       price=Decimal("1000.00")
                                                       )
        self.product_for_cart2 = Product.objects.create(category=self.category,
                                                        title="title1",
                                                        slug="title1",
                                                        main_img='k6-black-__5_1.jpg',
                                                        price=Decimal("1500.00")
                                                        )
        self.cart_product = CartProduct.objects.create(cart=self.cart, product=self.product_for_cart)
        self.short_img = ShortImgProduct.objects.create(product=self.product_for_cart2,
                                                        img='2/0/2003927362_1.jpeg')

        self.specification_product = SpecificationProduct.objects.create(product=self.product_for_cart2,
                                                                         name_spec='Бренд',
                                                                         value_spec='Назва'
                                                                         )

    def test_category_list(self):
        categories = CategorySerializers([self.category, self.category1, self.category2], many=True).data
        correct_data = [
            {
                'id': self.category.id,
                'name': self.category.name,
                'slug': self.category.slug
            },
            {
                'id': self.category1.id,
                'name': self.category1.name,
                'slug': self.category1.slug
            },
            {
                'id': self.category2.id,
                'name': self.category2.name,
                'slug': self.category2.slug
            },
        ]
        self.assertEqual(categories, correct_data)

    def test_cart_product(self):
        cart_product = CartProductSerializers(self.cart_product).data
        product = ProductWithoutCategorySerializers(self.product_for_cart).data
        correct_data = {
            "id": self.cart_product.id,
            "product": OrderedDict(product),
            "count": 1,
            "all_price": '1000.00',
            "cart": self.cart.id
        }
        self.assertEqual(cart_product, correct_data)

    def test_list_product(self):
        products = ProductListSerializers([self.product_for_cart, self.product_for_cart2], many=True).data
        category = CategorySerializers(self.category).data
        correct_data = [
            {
                'id': self.product_for_cart.id,
                'category': category,
                'title': self.product_for_cart.title,
                'slug': self.product_for_cart.slug,
                'price': '1000.00',
                'count_on_stock': 0,
                'main_img': self.product_for_cart.main_img,
                'new_product': True
            },
            {
                'id': self.product_for_cart2.id,
                'category': category,
                'title': self.product_for_cart2.title,
                'slug': self.product_for_cart2.slug,
                'price': '1500.00',
                'count_on_stock': 0,
                'main_img': self.product_for_cart2.main_img,
                'new_product': True
            }
        ]
        self.assertEqual(correct_data, products)

    def test_detail_product(self):
        product = ProductDetailSerializers(self.product_for_cart2).data
        category = CategorySerializers(self.category).data
        specification_product = SpecificationSerializers([self.specification_product], many=True).data
        short_img_product = ShortImgProductSerializers([self.short_img], many=True).data
        correct_data = {
            'id': self.product_for_cart2.id,
            'category': category,
            'title': self.product_for_cart2.title,
            'slug': self.product_for_cart2.slug,
            'price': '1500.00',
            'product_image': short_img_product,
            'specification': specification_product,
            'main_img': self.product_for_cart2.main_img,
            'in_cart': None
        }
        self.assertEqual(product, correct_data)


