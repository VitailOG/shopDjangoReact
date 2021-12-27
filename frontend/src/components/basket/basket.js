import React from 'react';
import { Link } from "react-router-dom";
import useSWR, { mutate } from "swr";

import { changeCountProductOnCartAPI, deleteFromCartAPI, getCartProductAPI } from "../../http/api/cart";
import { cartCustomer } from "../router/urls";
import Price from "./inc/price";
import Item from "./inc/item";

import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Basket() {

    let fetchFunc = () => getCartProductAPI().then(response => response)
    let { data, error } = useSWR(cartCustomer, fetchFunc)

    function changeCountProductOnCart(value, id) {
        changeCountProductOnCartAPI(id, value).then(() => {
            console.log('change')
            mutate(cartCustomer)
        })
    }

    function deleteFromCart(id) {
        deleteFromCartAPI(id).then(() => {
            console.log('delete')
            mutate(cartCustomer)
        }).catch(() => {
            console.log('error')
        })
    }

    if (!data) return ""
    if (error) return ""

    return (
        <div className="App" style={{ marginTop: "25px" }}>

            <div className="container mt-3">
                <h1 align="center">Корзина</h1>
                <Table style={{ textAlign: "center", marginTop: "15px", marginBottom: "70px", }}>
                    <thead>
                        <tr>
                            <th width='1' className="text-center" style={{ width: "50px" }}>Продукт</th>
                            <th width='1' className="text-center" style={{ width: "50px" }}>Кількість</th>
                            <th width='1' className="text-center" style={{ width: "50px" }}>Зображення</th>
                            <th width='1' className="text-center" style={{ width: "50px" }}>Ціна</th>
                            <th width='1' className="text-center" style={{ width: "50px" }}>Сума</th>
                            <th width='1' className="text-center" style={{ width: "50px" }}>Дія</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products.map(e => (
                            <Item e={e}
                                  changeCountProductOnCart={changeCountProductOnCart}
                                  deleteFromCart={deleteFromCart}
                            />
                        ))}
                    </tbody>
                    {data.all_product ?
                        <>
                            <tr>
                                <td>
                                    <Button variant="success" className="btn-success"
                                        style={{ marginTop: "5px", background: "#198754" }}>
                                        <Link to={{ pathname: `/order/`, fromDashboard: false }}
                                            style={{ textDecoration: "none", color: "white" }}>Оформлення
                                            замовлення</Link>
                                    </Button>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Загальна ціна</td>

                                <Price discount={data.discount}
                                       all_price={data.all_price}
                                       all_product={data.all_product}
                                />

                            </tr>
                        </>
                        :
                        ""
                    }
                </Table>

            </div>

        </div>
    );
}

export default Basket;
