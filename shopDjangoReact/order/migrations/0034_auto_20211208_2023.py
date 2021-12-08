# Generated by Django 3.1.7 on 2021-12-08 18:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0035_auto_20211205_1930'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('order', '0033_auto_20211208_1930'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='cart',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order_cart', to='shop.cart', verbose_name='Корзина'),
        ),
        migrations.AlterField(
            model_name='order',
            name='customer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_customer', to=settings.AUTH_USER_MODEL, verbose_name='Покупець'),
        ),
    ]