from django.contrib import admin
from .models import Order, PromoCode


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Замовлення"""
    list_display = ("id", "first_name", "last_name")
    list_display_links = ("id", "first_name")
    search_fields = ("first_name",)
    

@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    """Promo code"""
    list_display = ("id", "name", "interest")
    list_display_links = ("id", "name")
    readonly_fields = ("name", "end_of_action")
    search_fields = ("name",)
