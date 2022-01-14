import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from "./inc/menu";
import ModelOrder from "./inc/modelOrder";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { profileAPI } from "../../http/api/auth";
import OrderItem from "./inc/OrderItem";
import { ShimmerTable } from "react-shimmer-effects";


function Profile() {

    const [orders, setOrders] = useState([])
    const [obj, setObj] = useState({})
    const [show, setShow] = useState(false);
    const [ordering, setOrdering] = useState('');
    const [descending, setDescending] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const username = useSelector(state => state.auth.username)

    useEffect(() => {
        profileAPI(ordering).then(response => {
            setOrders(response)
        })
    }, [ordering]);

    const openModel = useCallback((order) => {
        setObj(order)
        handleShow()
    }, [])

    let sortTable = (e) => {
        setDescending(!descending)
        { descending ? setOrdering(e) : setOrdering('-' + e) }
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-start">
                <div className="col-3">
                    <Menu />
                </div>
                <div className="col-8">
                    <h2 style={{ "display": "block", "marginBottom": "25px" }}>Замовлення - {username}</h2>

                    {
                        orders.length >  0 ?
                            <Table style={{ "marginBottom": "50px" }}>
                                <thead>
                                <tr>
                                    <th width='1' onClick={() => sortTable('id')}
                                        className="text-center" style={{ width: "50px", cursor: "pointer" }}>Номер</th>
                                    <th width='1'
                                        className="text-center" style={{ width: "50px" }}>Дата замовлення</th>
                                    <th width='1' onClick={() => sortTable('cart__all_price')}
                                        className="text-center" style={{ width: "50px", cursor: "pointer" }}>Сума замовлень</th>
                                    <th width='1' className="text-center" style={{ width: "50px" }}>Детальніше</th>
                                </tr>
                                </thead>
                                <tbody>

                                {orders.map(e => (
                                    <OrderItem key={e.id} e={e} openModel={openModel}/>
                                ))}

                                </tbody>
                            </Table>
                            :
                            <ShimmerTable row={5} col={5} />
                    }


                </div>
            </div>
            <ModelOrder handleShow={handleShow}
                handleClose={handleClose}
                show={show}
                obj={obj}
            />

        </div>
    );
}

export default Profile;