import os

from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shopDjangoReact.settings')

app = Celery('shopDjangoReact')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'add-every-30-seconds': {
        'task': 'shop.tasks.send_info_about_sales_products',
        'schedule': 10.0,
    }
}

app.conf.timezone = 'UTC'