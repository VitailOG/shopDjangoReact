# Generated by Django 3.1.7 on 2021-11-26 20:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0032_product_change_status_on_stock'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='change_status_on_stock',
            new_name='status_on_stock',
        ),
    ]