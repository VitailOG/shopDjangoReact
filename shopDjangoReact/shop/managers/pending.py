from django.db import models


class PendingManager(models.Manager):
    
    def get_products_in_pending(self, user):
        return super().select_related('customer')\
                      .prefetch_related('product')\
                      .filter(customer=user).first()
            