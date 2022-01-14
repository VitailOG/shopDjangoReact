from typing import Tuple

from shop.models import ProductInPending, Product, CartProduct, Cart
from shop.services.cart import BaseCartService
from shop.utils import is_auth


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

    @is_auth
    def remove_product_from_pending(self, product):
        pending = ProductInPending.objects.get(customer=self.customer)
        if pending.product.filter(id=product.id).exists():
            pending.product.remove(product)

    def add_product_to_cart(self):
        cart = self.get_customer_cart()
        product = self._get_product(self.product_id)
        cart_product, created = self._create_cart_product(cart, product)

        if created:
            self.remove_product_from_pending(product)
            cart.products.add(cart_product)
            self.save_cart(cart)
        return created

    def __call__(self):
        return self.add_product_to_cart()
