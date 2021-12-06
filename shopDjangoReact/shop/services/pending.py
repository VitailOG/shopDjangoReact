from ..utils import check_product_in_cart
from ..models import ProductInPending


def correct_products_on_pending(products: ProductInPending, request):
    is_on_stock = products.product.all()
    id_products_in_cart = check_product_in_cart(request)
    for i in is_on_stock:
        if i.id in id_products_in_cart:
            products.product.remove(i)
    return products
    