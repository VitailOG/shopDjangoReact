from django.db import models


class ReviewManager(models.Manager):
    
    def get_review_by_product_id(self, id: int):
        return super().prefetch_related('children__customer')\
                      .select_related('customer')\
                      .filter(product__id=id)
                      