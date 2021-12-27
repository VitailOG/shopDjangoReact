import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useHistory } from "react-router-dom";
import CartNavbar from "./inc/cartNavbar";
import CustomBadge from "./inc/customBadge"
import { useSelector, useDispatch } from "react-redux";
import {
    clearSpecAction,
    limitAction,
    logoutAction,
    maxPriceAction, minPriceAction,
    offsetAction,
    searchAction,
    sortAction,
    countReminderCustomer,
    updateCountReminderCustomer
} from "../../store/actionCreators";
import { categoriesAPI, reminderCountAPI } from "../../http/api/product";
import { mutate } from "swr"
import { cartCustomer } from "../router/urls";


function Navbar({socket}) {

    // const socket = useRef();

    const [categories, setCategories] = useState([])

    const history = useHistory();

    const dispatch = useDispatch()

    const isAuth = useSelector(state => state.auth.isAuth)
    const reminderCount = useSelector(state => state.reminder.countReminder)

    useEffect(() => {
        reminderCountAPI().then(response => {
            dispatch(countReminderCustomer(response.reminder_count))
        })
    }, []);

    useEffect(() => {
        if (isAuth) {
            // socket.current = new WebSocket(`ws://127.0.0.1:8000/${username}/?token=${localStorage.getItem('token')}`)

            socket.onopen = () => {
                console.log('start')
            }

            socket.onmessage = (event) => {
                let data = JSON.parse(event.data)
                let num = data['data'];
                dispatch(updateCountReminderCustomer(num))
            }

            socket.onclose = () => {
                console.log('close')
            }

            socket.onerror = () => {
                console.log('error')
            }

        }
    }, [isAuth])

    useEffect(() => {
        categoriesAPI().then(response => {
            setCategories(response)
        })
    }, []);

    let clearFilters = () => {
        dispatch(offsetAction(0, 1))
        dispatch(limitAction(3))
        dispatch(sortAction('-id'))
        dispatch(searchAction(''))
        dispatch(minPriceAction(''))
        dispatch(maxPriceAction(''))
        dispatch(clearSpecAction())
    }

    let exit = () => {
        dispatch(logoutAction())
        history.push('/')
        mutate(cartCustomer)
    }

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container px-4 px-lg-5">
                    <Link className="navbar-brand"
                        to={{ pathname: `/`, fromDashboard: false }}>E-commerce</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle active" id="navbarDropdown" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">Категорії
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    {categories.map(e => (
                                        <li key={e.id}>
                                            <Link className="dropdown-item"
                                                to={{ pathname: `/category/${e.slug}`, fromDashboard: false }}
                                                onClick={() => clearFilters()}
                                            >{e.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {
                                !isAuth ?
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link"
                                                to={{ pathname: `/login/`, fromDashboard: false }}>Авторизація</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link"
                                                to={{ pathname: `/registration/`, fromDashboard: false }}>Реєстрація</Link>

                                        </li>
                                    </>
                                    :
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link"
                                                to={{ pathname: `/profile/`, fromDashboard: false }}>
                                                Профіль <CustomBadge reminderCount={reminderCount} />
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <button className="btn btn-outline-secondary"
                                                onClick={() => exit()}>Вихід
                                            </button>
                                        </li>
                                    </>
                            }

                        </ul>

                        <>
                            <Link style={{ 'textDecoration': 'none' }}
                                to={{ pathname: `/cart/`, fromDashboard: false }}><CartNavbar />
                            </Link>
                        </>

                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;