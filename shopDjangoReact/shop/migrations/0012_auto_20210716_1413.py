# Generated by Django 3.2.5 on 2021-07-16 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0011_auto_20210716_1405'),
    ]

    operations = [
        migrations.AlterField(
            model_name='specificationproduct',
            name='name_spec',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='specificationproduct',
            name='value_spec',
            field=models.CharField(max_length=100),
        ),
    ]
