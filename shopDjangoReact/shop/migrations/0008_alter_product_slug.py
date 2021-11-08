# Generated by Django 3.2.5 on 2021-07-06 16:48

import autoslug.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0007_alter_product_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='slug',
            field=autoslug.fields.AutoSlugField(allow_unicode=True, editable=True, populate_from='title', unique=True),
        ),
    ]
