from django.db import models

from customer.models import Customer


class CartManager(models.Manager):
    
    def get_cart_user(self, customer: Customer):
        return super().prefetch_related('products__product')\
                .filter(customer=customer, in_order=False).first()
