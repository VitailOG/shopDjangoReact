from celery import shared_task

from .services.report import CreateReportService

from django.core.mail import send_mail


@shared_task
def send_info_about_sales_products():
    data = CreateReportService()()
    result = ''
    for _, row in data.iterrows():
        result += f"{row['title']} - {row['count']}\n"
   
    send_mail(
        'Статистика',
        result,
        'vzaharkiv28@gmail.com',
        ['vzaharkiv28@gmail.com'],
        fail_silently=False
    )

    