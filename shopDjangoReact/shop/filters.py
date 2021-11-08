from django_filters.rest_framework import FilterSet, CharFilter, RangeFilter

from shop.models import Product


class ProductFilter(FilterSet):
    title = CharFilter(lookup_expr='icontains')
    price = RangeFilter()

    class Meta:
        model = Product
        fields = ('title', 'price')
