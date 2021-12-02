import datetime
import pandas as pd

from typing import List

from ..models import Product, CartProduct


def test():
    today = datetime.date.today()
    
    product_qs = Product.objects.values('id', 'title')
    product_df = pd.DataFrame(product_qs, columns=['id', 'title'])
    
    cart_product_qs = CartProduct.objects.filter(cart__in_order=True, cart__order_cart__order_date__month=today.month).values('product', 'count')
    cart_product_df = pd.DataFrame(cart_product_qs, columns=['product', 'count']).rename(columns={'product': 'product_id'})
    
    common_df = product_df.merge(cart_product_df, how="left", left_on='id', right_on='product_id')
    common_df['product_id'] = common_df['product_id'].fillna(-1).astype('Int64')
    
    common_df = common_df.groupby('title', as_index=False).agg({'count': 'sum'})
    common_df = common_df[common_df['count'] > 0]
    
    common_df['count'] = common_df['count'].astype('Int64')
    

class CreateReportService:
    """ Create report and send on email
    """
    def __init__(self):
        self.current_month = getattr(datetime.date.today(), 'month')
    
    def _get_cart_products(self) -> List[CartProduct]:
        return CartProduct.objects.get_cart_product_for_the_month(self.current_month)
    
    def _get_products(self) -> List[Product]:
        return Product.objects.values('id', 'title')
    
    def _convert_to_df() -> pd.DataFrame:
        pass
    
    def _merge_and_filters_obj():
        pass
    