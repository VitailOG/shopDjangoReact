from django.db import models


class SpecificationProductManager(models.Manager):
    
    def get_unique_specifications(self, slug: str):
        return super().filter(product__category__slug=slug)\
                      .values('name_spec', 'value_spec').distinct()
                      