# Generated by Django 3.2.10 on 2021-12-24 19:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0034_auto_20211208_2023'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='promocode',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
