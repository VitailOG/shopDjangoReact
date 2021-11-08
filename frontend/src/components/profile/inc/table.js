import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Image, Table, Modal} from "react-bootstrap";

function TableDetailProduct(props) {
    return (
        <div className="App">
            <Table style={{textAlign: "center"}}>
                    <thead>
                        <tr>
                            <th className="text-center" >Продукт</th>
                            <th className="text-center" >Кількість</th>
                            <th className="text-center" >Зображення</th>
                            <th className="text-center" >Ціна</th>
                            <th className="text-center" >Сума</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.obj.cart.products.map(e => (
                            <tr key={e.id}>
                                <td>{e.product.title}</td>
                                <td>{e.count}</td>
                                <td style={{verticalAlign: "middle", textAlign: "center"}}>
                                    <Image src={e.product.main_img}
                                           style={{width: "200px", height: "auto"}} fluid/>
                                </td>
                                <td>{e.product.price} грн.</td>
                                <td>{e.all_price} грн.</td>
                            </tr>
                        ))}
                    </tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Сума замолення</td>
                        {
                            props.obj.price_with_promo_code ?
                                <td><strong>{props.obj.price_with_promo_code}</strong> грн.</td>
                                :
                            props.obj.cart.discount === '0.00' ?
                            <td><strong>{props.obj.cart.all_price}</strong> грн.</td>
                            :
                            <td><strong>{props.obj.cart.discount}</strong> грн.</td>
                        }
                    </tr>
                </Table>
            <hr/>
            <div className="text-start">
                <p style={{ 'fontSize': '14px' }}>Імя: {props.obj.first_name}</p>
                <p style={{ 'fontSize': '14px' }}>Прізвище: {props.obj.last_name}</p>
                <p style={{ 'fontSize': '14px' }}>Пошта: {props.obj.phone}</p>
                <p style={{ 'fontSize': '14px' }}>Дата: доставки {props.obj.order_date}</p>
                <p style={{ 'fontSize': '14px' }}>Тип: доставки {props.obj.type_delivery}</p>
            </div>
        </div>
    );
}

export default TableDetailProduct;