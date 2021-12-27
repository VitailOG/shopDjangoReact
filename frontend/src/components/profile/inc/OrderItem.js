import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

function OrderItem({e, openModel}) {

    return (
        <>
            <tr>
                <td style={{ 'textAlign': 'center' }}>{e.id}</td>
                <td style={{ 'textAlign': 'center' }}>{e.order_date}</td>

                <td style={{ 'textAlign': 'center' }}>
                    {
                            e.price_with_promo_code !== null
                            ?
                            e.price_with_promo_code :
                            e.cart.discount === "0.00"
                                ?
                                e.cart.all_price
                                :
                                e.cart.discount

                    } грн.
                </td>

                <td style={{ 'textAlign': 'center' }}>
                    <a className="btn btn-info text-white"
                       onClick={() => openModel(e)}
                    >Детальніше</a>
                </td>
            </tr>
        </>
    );
}

export default React.memo(OrderItem);