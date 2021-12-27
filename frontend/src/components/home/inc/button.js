import React from 'react';
import Spinner from 'react-bootstrap/Spinner'
import {useLocation} from "react-router-dom";


function CustomButton(props) {

    let {pathname} = useLocation()

    return (
        <div className="App">

            {
                props.data.count_on_stock === 0 ?
                    (pathname !== '/in-pending/' ?
                        <button type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => props.addInPending(props.data.slug)}
                        >Добавити в очікування</button>
                        :
                        <button type="button"
                            className="btn btn-danger"
                            onClick={() => props.deleteFromPending(props.data.slug)}
                        >Видалити з очікувань</button>
                    )
                    :
                    (props.data.in_cart ?
                        <button type="button" className="btn btn-light" disabled>
                            Товар в корзині
                        </button>
                        :
                        <button className="btn btn-outline-dark mt-auto"
                            id={props.data.id}
                            onClick={() => props.addToCart(props.data)}
                        >
                            {
                                props.idProduct.includes(props.data.id) ?
                                    <>
                                        <Spinner as="span" animation="border" size="sm"
                                            role="status" aria-hidden="true" />
                                    </>
                                    :
                                    `Добавити в корзину`
                            }

                        </button>
                    )
            }
        </div>
    );
}

export default CustomButton;
