# Generated by Django 3.1.7 on 2021-11-21 15:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0031_auto_20211121_1447'),
        ('order', '0030_auto_20211121_1445'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='cart',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order_cart', to='shop.cart', verbose_name='Корзина'),
        ),
    ]
