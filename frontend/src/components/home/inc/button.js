import React from 'react';
import Spinner from 'react-bootstrap/Spinner'

function CustomButton(props) {

    return (
        <div className="App">

            {
                props.data.count_on_stock === 0 ?
                    (props.inPending !== '/in-pending/' ?
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
                                props.idProduct.includes(props.data.id) && props.isAuth ?
                                    <React.Fragment>
                                        <Spinner as="span" animation="border" size="sm"
                                            role="status" aria-hidden="true" />
                                    </React.Fragment>
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
