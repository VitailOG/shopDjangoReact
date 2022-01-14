from shop.services.cart import BaseCartService


class ChangeCountProductInCartService(BaseCartService):
    """ Change count product in cart
    """

    def __init__(self, cart_product_id: int, count: int, request):
        super().__init__(request)
        self.cart_product_id = cart_product_id
        self.count = count

    def validate_count_cart_product(self) -> bool:
        cart_product = self._get_cart_product(self.cart_product_id)

        if int(self.count) > cart_product.product.count_on_stock:
            return False
        return True

    def change_count_product_in_cart(self) -> bool:
        validate_count = self.validate_count_cart_product()
        cart = self.get_customer_cart()

        if validate_count:
            self._get_cart_product(self.cart_product_id, self.count)
            self.save_cart(cart)
            return validate_count
        return validate_count

    def __call__(self):
        return self.change_count_product_in_cart()
