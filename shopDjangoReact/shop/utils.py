from customer.models import Customer

from .services.cart import BaseCartService


def check_product_in_cart(customer: Customer):
    cart = BaseCartService().get_customer_cart(customer)
    return [i.product.id for i in cart.products.all()]


def check_exists_product_in_cart(user: Customer, data) -> None:
    if user.is_authenticated:
        id_product = check_product_in_cart(user)
        for product in data:
            product['in_cart'] = product['id'] in id_product

