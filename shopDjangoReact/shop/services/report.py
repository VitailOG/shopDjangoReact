import datetime
import pandas as pd

from typing import List

from ..models import Product, CartProduct


class CreateReportService:
    """ Create report and send on email
    """
    def __init__(self):
        self.current_month = getattr(datetime.date.today(), 'month')
        self.product_column_name = ['id', 'title']
        self.cart_product_column_name = ['product', 'count']
        
    def _get_cart_products(self) -> List[CartProduct]:
        return CartProduct.objects.get_cart_product_for_the_month(self.current_month)
    
    def _get_products(self) -> List[Product]:
        return Product.objects.values('id', 'title')
    
    def _convert_to_df(self, qs, columns) -> pd.DataFrame:
        return pd.DataFrame(qs, columns=columns)
    
    def _merge_and_filters(self) -> pd.DataFrame:
        products_qs = self._get_products()
        products_df = self._convert_to_df(products_qs, self.product_column_name)
        
        cart_products_qs = self._get_cart_products()
        cart_products_df = self._convert_to_df(cart_products_qs, self.cart_product_column_name).rename(columns={'product': 'product_id'})
        
        common_df = products_df.merge(cart_products_df, how="left", left_on='id', right_on='product_id')
        common_df = common_df.groupby('title', as_index=False).agg({'count': 'sum'})
        common_df = common_df[common_df['count'] > 0]
        common_df['count'] = common_df['count'].astype('Int64')
        
        return common_df
    
    def __call__(self):
        return self._merge_and_filters()
    