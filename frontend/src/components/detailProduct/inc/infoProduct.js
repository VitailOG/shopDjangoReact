import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Rating } from 'react-simple-star-rating'
import CustomButton from "../../home/inc/button";
import {useAddInPending} from "../../../hooks/useAddProductInPending";
import {useAddProductToCart} from "../../../hooks/useAddProductToCart";


function InfoProduct({changeRating, product, ratingProduct, userRating, setProduct}) {
    const {addInPending} = useAddInPending()
    const {addToCart, idProduct} = useAddProductToCart()

    const addProductToCart = (obj) =>{
        addToCart(obj, product, setProduct)
    }

    return (
        <>
            <h3>{product.title}</h3>
            <br />
            <p>Ціна: <strong>{product.price} грн.</strong></p>
            <div style={{ display: 'flex' }}>

                <Rating onClick={changeRating} ratingValue={userRating} size={30} fillColor={'rgb(255 190 8)'} />

                <div style={{ marginLeft: '3px' }}>
                    {!isNaN(ratingProduct) ? ratingProduct.toFixed(2) : ''}
                </div>
            </div>
            <br />

            <CustomButton addInPending={addInPending}
                          addToCart={addProductToCart}
                          idProduct={idProduct}
                          data={product}
            />

        </>
    );
}

export default React.memo(InfoProduct);
