import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import useSWR, { mutate } from "swr";
import {cartCustomer} from "../../router/urls";
import {getCartProductAPI} from "../../../http/api/cart";


function CartNavbar() {

    let fetchFunc = () => getCartProductAPI().then(response => response)
    let {data, error} = useSWR(cartCustomer, fetchFunc)

    if (!data) return ""
    if (error) return ""
    return (
        <div className="App">
            <form className="d-flex">
                <button className="btn btn-outline-dark" type="submit">
                    <i className="bi-cart-fill me-1"></i>
                    Корзина
                    <span className="badge bg-dark text-white ms-1 rounded-pill">{data.all_product ? data.all_product: 0}</span>
                </button>
            </form>

        </div>
    );
}

export default CartNavbar;