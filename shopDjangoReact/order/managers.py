from django.db import models

from customer.models import Customer


class OrderManager(models.Manager): 
    
    def get_all_order_customer(self, customer: Customer):
        return super().exclude(cart__all_product=0)\
                      .prefetch_related('cart__products__product')\
                      .select_related('cart')\
                      .filter(customer=customer)
                      