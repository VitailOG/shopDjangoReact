from django.contrib import admin
from .models import *


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Категорії"""
    list_display = ("id", "name", "slug")
    list_display_links = ("id", "name")
    prepopulated_fields = {"slug": ("name",)}


class ShortImgProductInlines(admin.TabularInline):
    model = ShortImgProduct
    extra = 0


class SpecInlines(admin.TabularInline):
    model = SpecificationProduct
    fk_name = "product"
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "count_on_stock")
    list_display_links = ("id", "title", "count_on_stock")
    search_fields = ("title",)
    prepopulated_fields = {"slug": ("title",)}
    inlines = [SpecInlines, ShortImgProductInlines]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "product")
    list_display_links = ("id", "customer", "product")
    # readonly_fields = ("review",)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Планшети"""
    list_display = ("id", "all_product", "for_anonymous_user", "customer")
    list_display_links = ("id",)
    # readonly_fields = ('in_order',)


@admin.register(RatingProduct)
class RatingProductAdmin(admin.ModelAdmin):
    list_display = ("id", "value", "ip_address_user", "product")
    list_display_links = ("id",)


admin.site.register(CartProduct)
admin.site.register(ProductInPending)
admin.site.register(Reminder)
