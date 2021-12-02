import random
import datetime
import string

from django.utils import timezone

from django.db import models

from customer.models import Customer
from shop.models import Cart
from .managers import OrderManager


class Order(models.Model):
    """Замовлення"""
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='order_customer',
        verbose_name='Покупець'
    )
    first_name = models.CharField(
        verbose_name='Імя',
        max_length=255
    )
    last_name = models.CharField(
        verbose_name='Прізвище',
        max_length=255
    )
    phone = models.CharField(
        verbose_name='Номер',
        max_length=255
    )
    address = models.CharField(
        verbose_name='Адрес',
        blank=True,
        null=True,
        max_length=255
    )
    type_delivery = models.CharField(
        verbose_name='Тип доставки',
        max_length=255
    )
    create_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата замовлення'
    )
    order_date = models.DateField(
        verbose_name='Дата на виконання',
        default=timezone.now
    )
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        verbose_name='Корзина',
        related_name="order_cart",
        blank=True,
        null=True
    )
    promo_code = models.ForeignKey(
        'PromoCode',
        on_delete=models.CASCADE,
        verbose_name='Промокод замовлення',
        blank=True,
        null=True
    )
    price_with_promo_code = models.DecimalField(
        max_digits=9,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name="Сума замовлення із можливим промокодом"
    )
    
    objects = OrderManager()
    
    def __str__(self):
        return str(self.id)

    class Meta:
        verbose_name = 'Замолення'
        verbose_name_plural = 'Замолення'


class PromoCode(models.Model):
    """ Promo code for customers orders
    """
    name = models.CharField(
        verbose_name="Назва промокода",
        max_length=32,
        null=True
    )
    interest = models.PositiveIntegerField(
        verbose_name="Відсотки промокода"
    )
    end_of_action = models.DateTimeField(blank=True)

    class Meta:
        verbose_name = 'Промо код'
        verbose_name_plural = 'Промо коди'

    def save(self, *args, **kwargs):
        if not self.pk:
            self.name = ''.join([random.choice(string.ascii_letters + string.digits) for _ in range(8)])
            self.end_of_action = timezone.now() + datetime.timedelta(days=7)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
