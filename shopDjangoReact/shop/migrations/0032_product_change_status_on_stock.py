# Generated by Django 3.1.7 on 2021-11-26 20:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0031_auto_20211121_1447'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='change_status_on_stock',
            field=models.BooleanField(default=False, verbose_name='Статус на відсутність на складі'),
        ),
    ]
