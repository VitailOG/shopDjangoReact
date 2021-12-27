import React from 'react';
import {Badge} from "react-bootstrap";

function Price({discount, all_price, all_product}) {

    return (
        <>
            {
                discount === '0.00' ?
                    <td><strong>{all_price}</strong> грн.</td>
                    :
                    all_product < 6 ?
                        <td><strong>{discount}</strong> грн.
                            <Badge className="badge bg-success">5%</Badge>
                        </td>
                        :
                        <td><strong>{discount}</strong> грн.
                            <Badge className="badge bg-info">10%</Badge>
                        </td>
            }
        </>
    );
}

export default Price;
