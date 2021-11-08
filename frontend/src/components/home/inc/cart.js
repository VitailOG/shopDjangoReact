import React, {useRef} from 'react';
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner'

function Cart(props) {

    let inPending = window.location.pathname

    // console.log('cart')
    return (
        <div className="App">

            <div className="col mb-5">
                <div className="card h-100">
                    {
                        props.data.new_product ?
                             <div className="badge bg-dark text-white position-absolute"
                             style={{'top': '0.5rem', 'right': '0.5rem'}}>NEW</div>
                         : ""
                    }
                    <Link to={{ pathname: `/product/${props.data.slug}`, fromDashboard: false }}
                    style={{ 'textDecoration': 'none', 'color': 'black' }}>
                        <img className="card-img-top" src={props.data.main_img} alt="..."/>
                        <div className="card-body p-4">
                            <div className="text-center">
                                <h5 className="fw-bolder">{props.data.title}</h5>
                                {props.data.price} грн.
                            </div>
                        </div>
                    </Link>
                    <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div className="text-center">

                            {
                                props.data.count_on_stock === 0 ?
                                (   inPending !== '/in-pending/' ?
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
                                                           role="status" aria-hidden="true"/>
                                                    </React.Fragment>
                                                       :
                                                    `Добавити в корзину`
                                            }

                                    </button>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Cart;
// export default React.memo(Cart, (prevProps, nextProps) =>{
    // if(prevProps.idProduct.lenght){
    //     console.log(1)
    //     if(nextProps.idProduct.slice(-1)[0] === nextProps.data.id){
    //         return false
    //     }else{
    //         return true
    //     }
    // }else{
    //     console.log(10)
    //     return false
    // }

// });
