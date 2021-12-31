import React from 'react';
import CustomButton from './button'
import LoaderProduct from "./loaderProduct";


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
                    <div onClick={() => props.fetchProduct(props.data.slug)} style={{ cursor: "pointer" }}>
                        <img className="card-img-top" src={props.data.main_img} alt="..." />

                        <div className="card-body p-4">
                            <div className="text-center">
                                <h5 className="fw-bolder">{props.data.title}</h5>
                                {props.data.price} грн.
                            </div>
                        </div>
                    </div>

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
