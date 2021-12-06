from django.db import models

from customer.models import Customer


class CartManager(models.Manager):
    
    def get_cart_user(self, customer: Customer, user_ip):
        common_qs = super().prefetch_related('products__product')
        qs = common_qs.filter(customer=customer, in_order=False).first()
        for_anonymos = common_qs.filter(for_anonymous_user=user_ip, in_order=False, customer__isnull=True)

        if for_anonymos.first() and for_anonymos.first().products.count() > 0:
            qs.delete()
            
            for_anonymos = for_anonymos.first()
            for_anonymos.customer = customer
            for_anonymos.save()
            
            return for_anonymos
        
        return qs
    