import os

from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shopDjangoReact.settings')

app = Celery('shopDjangoReact')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

# app.conf.schedule = {
# }
