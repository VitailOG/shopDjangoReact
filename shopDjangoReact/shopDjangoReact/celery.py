import os

from celery import Celery
from celery.schedules import crontab


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shopDjangoReact.settings')

app = Celery('shopDjangoReact')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'add-every-month': {
        'task': 'shop.tasks.send_info_about_sales_products',
        'schedule': crontab(0, 0, day_of_month='1'),
    }
}

app.conf.timezone = 'UTC'
