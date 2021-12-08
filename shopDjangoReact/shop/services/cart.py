from uuid import uuid4
from typing import Optional, Tuple

from django.db.models import Sum
from rest_framework import status

from rest_framework.response import Response

from shop.models import (
    Cart,
    Product,
    CartProduct,
    ProductInPending
)

class BaseCartService:
    """ Base service for cart
    """
    
    def __init__(self, request):
        self.request = request
        self.customer = getattr(request, 'user')
    
    @staticmethod
    def _get_cart_product(id: int, count=None):
        return CartProduct.objects.get_or_update_cart_product_by_id(id, count)
    
    def save_cart(self, cart):
        cart_product = cart.related_products.aggregate(Sum('all_price'))['all_price__sum']
        count = cart.related_products.aggregate(Sum('count'))['count__sum']
        if cart_product:
            if 3 <= count <= 5:
                cart.discount = cart_product - (cart_product * 5) / 100
                cart.all_price = 0
            elif count > 5:
                cart.discount = cart_product - (cart_product * 10) / 100
                cart.all_price = 0
            else:
                cart.all_price = cart_product
                cart.discount = 0
        else:
            cart.discount = 0
            cart.all_price = 0

        cart.all_product = count
        cart.save()
        
    def get_customer_cart(self) -> Optional[Cart]:
        
        from ..utils import get_client_ip         
        user_ip = get_client_ip(self.request)
        
        if self.customer.is_authenticated:    
            cart = Cart.objects.get_cart_user(customer=self.customer, user_ip=user_ip)
            
            if not cart:
                cart = Cart.objects.create(customer=self.customer)
            return cart
        
        # for anonymous customer        
        cart = Cart.objects.all().get_cart_for_anonymous_customer(user_ip)        
        
        if not cart:
            return Cart.objects.create(for_anonymous_user=user_ip)
        
        return cart.first()
    
    def get_only_present_products_on_stock(self) -> Cart:
        cart = self.get_customer_cart()
        for i in cart.products.filter(product__count_on_stock=0):
            if self.customer.is_authenticated:
                ProductInPending.objects.filter(customer=cart.customer).first().product.add(i.product)
            cart.products.remove(i)
            i.delete()
            self.save_cart(cart)
        return cart


class AddProductToCartService(BaseCartService):
    """ Add product to cart 
    """
    def __init__(self, product_id: int, request):
        super().__init__(request)
        self.product_id = product_id
        
    def _create_cart_product(self, cart: Cart, product: Product) -> Tuple[CartProduct, bool]:
        cart_product, created = CartProduct.objects.get_or_create(
            cart=cart, product=product
        )
        return cart_product, created

    def _get_product(self, id: int) -> Product:
        return Product.objects.get_product_by_id(id)
    
    def add_product_to_cart(self):
        cart = self.get_customer_cart()
        product = self._get_product(self.product_id)
        cart_product, created = self._create_cart_product(cart, product)
        
        if created:
            cart.products.add(cart_product)
            self.save_cart(cart)
        return created

    def __call__(self):
        return self.add_product_to_cart()


class DeleteProductFromCartService(BaseCartService):
    """ Delete product from cart 
    """
    
    def __init__(self, cart_product_id: int, request):
        super().__init__(request)
        self.cart_product_id = cart_product_id
    
    def delete_product_from_cart(self):
        cart_product = self._get_cart_product(self.cart_product_id)
        cart = self.get_customer_cart()
        
        try:
            cart.products.remove(cart_product)
            cart_product.delete()
            self.save_cart(cart)
        except AttributeError:
            return Response(status=status.HTTP_204_NO_CONTENT)

    def __call__(self):
        return self.delete_product_from_cart()


class ChangeCountProductInCartService(BaseCartService):
    """ Change count product in cart
    """
    def __init__(self, cart_product_id: int, count: int, request):
        super().__init__(request)
        self.cart_product_id = cart_product_id
        self.count = count
    
    def validate_count_cart_product(self):
        cart_product = self._get_cart_product(self.cart_product_id)
        
        if int(self.count) > cart_product.product.count_on_stock:
            return False
        return True
        
    def change_count_product_in_cart(self) -> None:
        validate_count = self.validate_count_cart_product()
        cart = self.get_customer_cart()

        if validate_count:
            self._get_cart_product(self.cart_product_id, self.count)
            self.save_cart(cart)
            return validate_count 
        return validate_count

    def __call__(self):
        return self.change_count_product_in_cart()
