from django.db import models

from customer.models import Customer


class ProductManager(models.Manager):
    
    def get_product_by_id(self, id: int):
        return super().filter(id=id).first()
    
    def get_product_by_slug(self, slug: str):
        return super().filter(slug=slug).first()
    
    def get_four_new_product(self):
        return super().get_queryset().order_by('-id').select_related('category')[:4]
