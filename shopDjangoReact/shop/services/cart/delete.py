from rest_framework.response import Response
from rest_framework import status

from shop.services.cart import BaseCartService


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
