from django.db.models import Sum

from shop.models import (
    ProductInPending,
    Cart,
    CartProduct
)


class BaseCartService:
    """ Base service for cart
    """

    def __init__(self, request):
        self.request = request
        self.customer = getattr(request, 'user')

    @staticmethod
    def _get_cart_product(id: int, count=None) -> CartProduct:
        return CartProduct.objects.get_or_update_cart_product_by_id(id, count)

    @staticmethod
    def save_cart(cart: Cart) -> None:
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

    def get_customer_cart(self) -> Cart:

        from shop.utils import get_client_ip
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
