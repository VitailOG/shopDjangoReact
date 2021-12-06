from django.db import models

class ProductManager(models.Manager):
    
    def get_product_by_id(self, id: int):
        return super().filter(id=id).first()
    
    def get_products_by_category(self, slug: str):
        return super().filter(category__slug=slug) \
                      .select_related('category')
    
    def get_product_by_slug(self, slug: str, related: bool = False):
        qs = super().filter(slug=slug)
        if related:
            qs.select_related('category')
        return qs.first()
    
    def get_four_new_product(self):
        return super().get_queryset().order_by('-id').select_related('category')[:4]
