import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Rating } from 'react-simple-star-rating'

function InfoProduct(props) {

    return (
        <>
            <h3>{props.productName}</h3>
            <br />
            <p>Ціна: <strong>{props.productPrice} грн.</strong></p>
            <div style={{ display: 'flex' }}>

                <Rating onClick={props.changeRating} ratingValue={props.userRating} size={30} fillColor={'rgb(255 190 8)'} />

                <div style={{ marginLeft: '3px' }}>
                    {!isNaN(props.ratingProduct) ? props.ratingProduct.toFixed(2) : ''}
                </div>
            </div>
            <br />
            <button className="btn bg-secondary">Кнопка</button>
        </>
    );
}

export default InfoProduct;