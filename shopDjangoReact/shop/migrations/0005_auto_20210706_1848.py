# Generated by Django 3.2.5 on 2021-07-06 15:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0004_auto_20210705_2300'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='review',
            options={'verbose_name': 'Відгук', 'verbose_name_plural': 'Відгуки'},
        ),
        migrations.RemoveField(
            model_name='product',
            name='image',
        ),
    ]
