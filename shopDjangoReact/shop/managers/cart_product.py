from typing import Optional

from django.db import models
from django.utils.translation import npgettext


class CartProductManager(models.Manager):
    
    def get_or_update_cart_product_by_id(self, id: int, count=None):
        qs = super().get(id=id)
        if count is not None:
            qs.count = int(count)
            qs.save()
            return qs
        return qs

    def get_cart_product_for_the_month(self, month):
        return super().filter(cart__in_order=True, cart__order_cart__order_date__month=month).values('product', 'count')    
    