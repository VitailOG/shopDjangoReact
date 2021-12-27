import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import Menu from "./inc/menu";
import Cart from "../home/inc/cart";

import { clearCountReminderCustomer } from "../../store/actionCreators"
import { deleteProductFromPendingAPI, productInPendingAPI } from "../../http/api/pending";
import { useAddProductToCart } from "../../hooks/useAddProductToCart";

import 'bootstrap/dist/css/bootstrap.min.css';
import CartLoader from "../home/inc/cartLoader";

function InPending({socket}) {

    const [products, setProducts] = useState([])
    const [load, setLoad] = useState(true)

    const dispatch = useDispatch()

    const username = useSelector(state => state.auth.username)

    const addProductToCartCustomer = useAddProductToCart(false)

    useEffect(() => {
        socket.send(JSON.stringify({'clear': true}))
        dispatch(clearCountReminderCustomer())
    }, [])

    useEffect(() => {
        productInPendingAPI().then(response => {
            setProducts(response.product)
            setLoad(false)
        })
    }, []);

    function deleteFromPending(slug) {
        deleteProductFromPendingAPI(slug).then(() => {
            setProducts(products => products.filter(product => product.slug !== slug))
        })
    }

    function addToCart(obj) {
        addProductToCartCustomer.addToCart(obj, products, setProducts)
        setProducts(products => products.filter(e => e.id !== obj.id))
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-start">
                <div className="col-3">
                    <Menu />
                </div>
                <div className="col-8">
                    <h2 style={{ "display": "block", "marginBottom": "25px" }}>Очікування - {username}</h2>

                    <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3">
                        {
                            load
                                ?
                                <>
                                    {Array(3).fill(
                                        <CartLoader/>
                                    )}
                                </>

                            :
                                products.map(e => (
                                    <Cart data={e}
                                        addToCart={addToCart}
                                        deleteFromPending={deleteFromPending}
                                        idProduct={addProductToCartCustomer.idProduct}
                                    />
                                ))}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default InPending;