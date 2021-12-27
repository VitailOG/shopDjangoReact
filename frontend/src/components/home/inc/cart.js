import React, { useRef } from 'react';
import { Link } from "react-router-dom";

import CustomButton from './button'


function Cart(props) {

    return (
        <div className="App">

            <div className="col mb-5">
                <div className="card h-100">
                    {
                        props.data.new_product ?
                            <div className="badge bg-dark text-white position-absolute"
                                style={{ 'top': '0.5rem', 'right': '0.5rem' }}>NEW</div>
                            : ""
                    }
                    <Link to={{ pathname: `/product/${props.data.slug}`, fromDashboard: false }}
                        style={{ 'textDecoration': 'none', 'color': 'black' }}>
                        <img className="card-img-top" src={props.data.main_img} alt="..." />
                        <div className="card-body p-4">
                            <div className="text-center">
                                <h5 className="fw-bolder">{props.data.title}</h5>
                                {props.data.price} грн.
                            </div>
                        </div>
                    </Link>
                    <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div className="text-center">

                            <CustomButton
                                addInPending={props.addInPending}
                                addToCart={props.addToCart}
                                deleteFromPending={props.deleteFromPending}

                                idProduct={props.idProduct}
                                data={props.data}
                            />


                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Cart;
