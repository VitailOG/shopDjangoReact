# Generated by Django 3.2.5 on 2021-07-29 19:49

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0008_alter_order_order_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_date',
            field=models.DateField(default=datetime.datetime(2021, 7, 29, 19, 49, 40, 651364, tzinfo=utc), verbose_name='Дата на виконання'),
        ),
    ]
