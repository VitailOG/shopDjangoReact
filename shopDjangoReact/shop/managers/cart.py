from django.db import models
from django.db.models.query import QuerySet

from customer.models import Customer


class CartQuerySet(QuerySet):
    
    def get_cart_for_anonymous_customer(self, user_ip: str):
        return self.prefetch_related('products__product').filter(for_anonymous_user=user_ip, in_order=False, customer__isnull=True)
    

class CartManager(models.Manager):
    
    def get_queryset(self):
        return CartQuerySet(
            model=self.model,
            using=self._db
        )
    
    def get_cart_user(self, customer: Customer, user_ip):
        qs = super().prefetch_related('products__product').filter(customer=customer, in_order=False).first()
        for_anonymos = self.get_queryset().get_cart_for_anonymous_customer(user_ip)

        if for_anonymos.first() and for_anonymos.first().products.count() > 0:
            qs.delete()
            
            for_anonymos = for_anonymos.first()
            for_anonymos.customer = customer
            for_anonymos.save()
            
            return for_anonymos
        
        return qs
    