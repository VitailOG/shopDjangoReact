from django.db.models import Sum
from rest_framework import status

from rest_framework.response import Response

from customer.models import Customer
from shop.models import (
    Cart,
    Product,
    CartProduct,
    ProductInPending
)


def create_cart_product(cart: Cart, product: Product):
    cart_product, created = CartProduct.objects.get_or_create(
        cart=cart, product=product
    )
    return cart_product, created


def add_product_to_cart(cart: Cart, product: Product):
    cart_product, created = create_cart_product(cart, product)
    if created:
        cart.products.add(cart_product)
        save_cart(cart)
    return created


def delete_product_from_cart(cart: Cart, cart_product: CartProduct):
    try:
        cart.products.remove(cart_product)
        cart_product.delete()
        save_cart(cart)
    except AttributeError:
        return Response(status=status.HTTP_204_NO_CONTENT)


def change_count_product_in_cart(cart_product, count):
    cart_product.update(count=count)
    cart_product.first().save()
    save_cart(cart_product.first().cart)


def save_cart(cart):
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


def get_customer_cart(customer: Customer):
    if customer.is_authenticated:
        cart = Cart.objects.prefetch_related('products__product')\
            .filter(customer=customer, in_order=False).first()
        if not cart:
            cart = Cart.objects.create(customer=customer)
        return cart
    return None


def get_only_present_products_on_stock(cart: Cart):
    for i in cart.products.filter(product__count_on_stock=0):
        ProductInPending.objects.filter(customer=cart.customer).first().product.add(i.product)
        cart.products.remove(i)
        i.delete()
        save_cart(cart)
    return cart


def delete_product_not_in_pending(products: ProductInPending):
    from .product import check_product_in_cart

    is_on_stock = products.product.all()
    id_products_in_cart = check_product_in_cart(products.customer)
    for i in is_on_stock:
        if i.id in id_products_in_cart:
            products.product.remove(i)
    return products
