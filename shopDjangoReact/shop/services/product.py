from customer.models import Customer
from .cart import get_customer_cart
from ..models import RatingProduct


def check_product_in_cart(customer: Customer):
    cart = get_customer_cart(customer)
    return [i.product.id for i in cart.products.all()]


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def create_rating(request, product_id, value):
    _, create = RatingProduct.objects.update_or_create(
        ip_address_user=get_client_ip(request),
        product_id=product_id,
        defaults={
            'value': value,
        }
    )
    return create


# class ProductService:
#     """Service for products"""

#     __slots__ = "request"

#     def __init__(self, request) -> None:
#         self.request = request

#     def check_product_in_cart(self, customer: Customer):
#         cart = get_customer_cart(customer)
#         return [i.product.id for i in cart.products.all()]

#     @staticmethod
#     def get_client_ip(request):
#         x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#         if x_forwarded_for:
#             ip = x_forwarded_for.split(',')[-1].strip()
#         else:
#             ip = request.META.get('REMOTE_ADDR')
#         return ip
    
#     @staticmethod
#     def check_exists_product_in_cart(user, data) -> None:
#         if user.is_authenticated:
#             id_product = check_product_in_cart(user)
#             for product in data:
#                 product['in_cart'] = product['id'] in id_product

#     def get_products_on_home_page(self):
#         products = Product.objects.get_four_new_product().select_related('category')
#         return products
