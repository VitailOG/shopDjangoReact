import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from "./inc/menu";
import Cart from "../home/inc/cart";
import {inPendingProduct, viewAllProductInPending} from "../router/urls";
import LoaderProduct from "../home/inc/loaderProduct";
import useSWR from "swr";
import $axios from "../../http";

import {useSelector} from "react-redux";
import {deleteProductFromPendingAPI, productInPendingAPI, viewAllProductsAPI} from "../../http/api/pending";
import {useAddProductToCart} from "../../hooks/useAddProductToCart";

function InPending(props) {

    props.setCurrentUrl(window.location.href)

    const [products, setProducts] = useState([])
    const [load, setLoad] = useState(true)

    const username = useSelector(state => state.auth.username)

    const addProductToCartCustomer = useAddProductToCart()

    useEffect(() =>{
        viewAllProductsAPI().then(() =>{
            console.log('View')
        })
    }, [])

    useEffect(()  => {
        productInPendingAPI().then(response => {
            setProducts(response.product)
            setLoad(false)
        })
    }, []);

    function deleteFromPending(slug){
        deleteProductFromPendingAPI(slug).then(() =>{
            setProducts(products => products.filter(product => product.slug !== slug))
            console.log('delete')
        })
    }

    function addToCart(obj){
        addProductToCartCustomer.addToCart(obj, products, setProducts)
    }

     return (
        <div className="container mt-4">
             <div className="row justify-content-start">
                <div className="col-3">
                    <Menu/>
                </div>
                <div className="col-8">
                    <h2 style={{ "display": "block", "marginBottom": "25px" }}>Очікування - {username}</h2>

                        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3">
                            {
                                load
                                    ?
                                    <LoaderProduct/>
                                :
                                    products.map(e =>(
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