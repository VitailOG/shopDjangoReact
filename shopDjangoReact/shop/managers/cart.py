from django.db import models
from django.db.models import Q
from django.db.models.query import QuerySet

from customer.models import Customer


class CartQuerySet(QuerySet):
    
    def get_cart_for_anonymous_customer(self, user_ip: str):
        return self.prefetch_related('products__product').filter(
            for_anonymous_user=user_ip,
            in_order=False,
            customer__isnull=True
        )
    

class CartManager(models.Manager):
    
    def get_queryset(self):
        return CartQuerySet(
            model=self.model,
            using=self._db
        )
    
    def get_cart_user(self, customer: Customer, user_ip):
        qs = super().prefetch_related('products__product').filter(customer=customer, in_order=False).first()
        for_anonymos = self.get_queryset().get_cart_for_anonymous_customer(user_ip).first()

        if for_anonymos and for_anonymos.all_product:

            if qs:
                qs.delete()

            for_anonymos.customer = customer
            for_anonymos.save()

            return for_anonymos

        return qs

    def get_cart_by_customer_or_ip(self, user_or_none: None | Customer, user_ip: str):
        return super().filter(
            Q(for_anonymous_user=user_ip, customer__isnull=True) |
            Q(customer=user_or_none),
            in_order=False
        ).first()
