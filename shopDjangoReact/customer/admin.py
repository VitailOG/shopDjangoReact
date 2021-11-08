from django.utils.translation import gettext_lazy as _
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Customer


@admin.register(Customer)
class CustomerAdmin(UserAdmin):
    """ Class admin for custom model `User`
    """
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'customer_phone', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Additional Info'), {'fields': ('customer_phone',)}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

