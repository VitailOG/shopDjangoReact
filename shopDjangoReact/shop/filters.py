from django_filters.rest_framework import FilterSet, CharFilter, RangeFilter

from shop.models import Product


class ProductFilter(FilterSet):
    title = CharFilter(lookup_expr='icontains')
    price = RangeFilter()
    specification__value_spec = CharFilter(method='filter_by_specification')
    
    class Meta:
        model = Product
        fields = ('title', 'price')

    def filter_by_specification(self, queryset, name, value):
        print(value.split('+'))
        specs = queryset.filter(specification__value_spec__in=value.split('+'))
        return specs
    