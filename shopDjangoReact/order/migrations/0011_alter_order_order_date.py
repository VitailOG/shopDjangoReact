# Generated by Django 3.2.5 on 2021-08-14 17:59

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0010_alter_order_order_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_date',
            field=models.DateField(default=datetime.datetime(2021, 8, 14, 17, 59, 8, 744111, tzinfo=utc), verbose_name='Дата на виконання'),
        ),
    ]