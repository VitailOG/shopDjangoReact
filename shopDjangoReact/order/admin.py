from django.contrib import admin
from .models import Order, PromoCode


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Замовлення"""
    list_display = ("id", "first_name", "last_name")
    list_display_links = ("id", "first_name")
    search_fields = ("first_name",)
    
    def get_queryset(self, request):
        print(1)
        return super().get_queryset(request).select_related('customer', 'cart', 'promo_code')


@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    """Promo code"""
    list_display = ("id", "name", "interest", "end_of_action")
    list_display_links = ("id", "name")
    readonly_fields = ("name",)
    search_fields = ("name",)
