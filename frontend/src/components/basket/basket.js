import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import {cartCustomer} from "../router/urls";
import {Table, Image, Button, Badge} from 'react-bootstrap';
import useSWR, { mutate } from "swr";
import {changeCountProductOnCartAPI, deleteFromCartAPI, getCartProductAPI} from "../../http/api/cart";

function Basket(props) {
    props.setCurrentUrl(window.location.href)

    let fetchFunc = () => getCartProductAPI().then(response => response)
    let {data, error} = useSWR(cartCustomer, fetchFunc)

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
        <div className="App" style={{marginTop: "25px"}}>

            <div className="container mt-3">
                <h1 align="center">Корзина</h1>
                <Table style={{textAlign: "center", marginTop: "15px", marginBottom: "70px",}}>
                    <thead>
                    <tr>
                        <th width='1' className="text-center" style={{width: "50px"}}>Продукт</th>
                        <th width='1' className="text-center" style={{width: "50px"}}>Кількість</th>
                        <th width='1' className="text-center" style={{width: "50px"}}>Зображення</th>
                        <th width='1' className="text-center" style={{width: "50px"}}>Ціна</th>
                        <th width='1' className="text-center" style={{width: "50px"}}>Сума</th>
                        <th width='1' className="text-center" style={{width: "50px"}}>Дія</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.products.map(e => (
                        <tr key={e.id}>
                            <td>{e.product.title}</td>
                            <td>
                                <form>
                                    <input className="form-control"
                                           defaultValue={e.count}
                                           onChange={event => changeCountProductOnCart(event.target.value, e.id)}
                                           // onChange={changeCountProductOnCart(e.id)}
                                           min="1"
                                           max={e.product.count_on_stock}
                                           style={{width: "60px", margin: "0 auto"}}
                                           type="number"/>
                                </form>
                            </td>
                            <td style={{verticalAlign: "middle", textAlign: "center"}}>
                                <Image src={e.product.main_img}
                                       style={{width: "200px", height: "auto"}} fluid/>
                            </td>
                            <td>{e.product.price} грн.</td>
                            <td>{e.all_price} грн.</td>
                            <td>
                                <Button variant="danger"
                                        size="md"
                                        id={e.id}
                                        onClick={() => deleteFromCart(e.id)}
                                        block>Видалити</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    {data.all_product ?
                        <React.Fragment>
                            <tr>
                                <td>
                                    <Button variant="success" className="btn-success"
                                            style={{marginTop: "5px", background: "#198754"}}>
                                        <Link to={{pathname: `/order/`, fromDashboard: false}}
                                              style={{textDecoration: "none", color: "white"}}>Оформлення
                                            замовлення</Link>
                                    </Button>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Загальна ціна</td>

                                {data.discount === '0.00' ?
                                    <td><strong>{data.all_price}</strong> грн.</td>
                                    :
                                    data.all_product < 6 ?
                                        <td><strong>{data.discount}</strong> грн.
                                            <Badge className="badge bg-success">5%</Badge>
                                        </td>
                                        :
                                        <td><strong>{data.discount}</strong> грн.
                                            <Badge className="badge bg-info">10%</Badge>
                                        </td>
                                }

                            </tr>
                        </React.Fragment>
                        :
                        ""
                    }
                </Table>

            </div>

        </div>
    );
}

export default Basket;
