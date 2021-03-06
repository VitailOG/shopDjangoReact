# Generated by Django 3.2.5 on 2021-07-21 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0018_auto_20210721_1634'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='count_on_stock',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='product',
            name='main_img',
            field=models.ImageField(blank=True, null=True, upload_to='product_img/'),
        ),
    ]
