def check_product_in_cart(request):
    from .services.cart.base import BaseCartService

    cart = BaseCartService(request).get_customer_cart()
    return [i.product.id for i in cart.products.all()]


def check_exists_product_in_cart(request, data) -> None:
    id_product = check_product_in_cart(request)
    for product in data:
        product['in_cart'] = product['id'] in id_product


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def is_auth(func):
    def inner(*args, **kwargs):
        is_user_auth = args[0].customer.is_authenticated
        if is_user_auth:
            return func(*args, **kwargs)
    return inner
