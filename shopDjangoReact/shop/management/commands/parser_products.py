import requests

from bs4 import BeautifulSoup as BS
from random import choice

from django.core.management import BaseCommand, CommandError

from shop.models import Product, ShortImgProduct, SpecificationProduct


class ParserProduct:

    def __init__(self, url):
        self.url = url
        self.headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                          ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'accept': '*/*'
        }

    def get_page(self, url):
        response = requests.get(url=url, headers=self.headers)
        return response

    def __get_all_link(self):
        bs = BS(self.get_page(self.url).text, 'html.parser')
        list_link = []
        soup = bs.find_all('div', class_='product-card__pictures')
        for i in soup:
            list_link.append(i.find('a', class_='product-gallery__link').get('href'))
        return list_link

    @staticmethod
    def parse_specification(specifications):
        values = [(specifications[i].get_text(strip=True),
                   specifications[i + 1].get_text(strip=True))
                  for i in range(0, len(specifications), 2)]
        return values

    def get_product_info(self):
        date = []
        for i in self.__get_all_link()[:1]:
            bs = BS(self.get_page(i).text, 'html.parser')
            name = bs.find('div', class_='product-view__header').find('h1', class_='p-view__header-title').text

            price = bs.find('div', class_='p-trade-price__current').find('span', class_='sum').get_text(strip=True)
            price = ''.join(list(filter(lambda x: x != '\xa0', list(price)))[:-2])

            list_images = bs.find('div', class_='v-slider__items').find_all('div', class_='v-slider__item')
            link_images = [i.find('img', class_='main-gallery__image').get('data-src') for i in list_images][1:]

            if self.url == 'https://allo.ua/ua/products/notebooks/':
                specifications = bs.find('div', class_='p-specs__groups-list') \
                    .find_all('td', class_='p-specs__cell')

                values = self.parse_specification(specifications)[1:8]

            else:
                specifications = bs.find('table', class_='product-estimate__details') \
                    .find('tbody', class_='product-details-body').find_all('td')

                values = self.parse_specification(specifications)

            brand = bs.find('ul', {'id': 'breadcrumbs'}).find_all('li')[2].get_text(strip=True).split()[-1]

            values.append(('Бренд', brand))

            date.append({
                "name": name,
                "price": price,
                "images": link_images,
                "specification": values
            })
        return date


class Command(BaseCommand):
    help = "Parsing data for the store"

    CATEGORY = {
        1: 'https://allo.ua/ua/products/mobile/',
        2: 'https://allo.ua/ua/kompjutery/',
        3: 'https://allo.ua/ua/products/internet-planshety/',
        4: 'https://allo.ua/ua/products/notebooks/',
    }

    def add_arguments(self, parser):
        parser.add_argument('number', type=int)

    def handle(self, *args, **options):

        if options['number'] > 4 or options['number'] < 1:
            raise CommandError('The number must be greater than 0 and less than 5')

        parser_product = ParserProduct(self.CATEGORY[options['number']])
        objects = parser_product.get_product_info()
        count_in_stock = [0, 5, 10, 15, 20]
        for i in objects:
            if i['images']:
                product = Product.objects.create(category_id=options['number'],
                                                 title=i['name'],
                                                 main_img=i['images'].pop(0),
                                                 price=i['price'],
                                                 count_on_stock=choice(count_in_stock)
                                                 )
                for _ in i['images']:
                    ShortImgProduct.objects.create(product=product, img=_)
                for _ in i['specification']:
                    SpecificationProduct.objects.create(product=product, name_spec=_[0], value_spec=_[1])
                self.stdout.write(self.style.SUCCESS('Created'))
