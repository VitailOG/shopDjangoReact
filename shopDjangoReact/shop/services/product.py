from typing import Union

from django.core.cache import cache
from django.conf import settings

from ..models import RatingProduct, Product
from ..utils import get_client_ip


class BaseProductService:
    
    def set_to_cache(self, slug: str, obj: Product):
        cache.set(slug, obj, timeout=settings.CACHE_TTL)
        
    def _get_from_cache(self, slug: str):
        if slug in cache:
            return cache.get(slug)
        return False


class DetailProductService(BaseProductService):
    
    def __init__(self, slug_or_id: Union[str, int]):
        self.slug_or_id = slug_or_id
    
    def get_product(self):
        product = self._get_from_cache(self.slug_or_id)
        if not product:
            product = Product.objects.get_product_by_slug(slug=self.slug_or_id, related=True)
        self.set_to_cache(self.slug_or_id, product)
        return product

    def create_rating(self, request, value):
        _, create = RatingProduct.objects.update_or_create(
            ip_address_user=get_client_ip(request),
            product_id=self.slug_or_id,
            defaults={
                'value': value,
            }
        )

        return create
