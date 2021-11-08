import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useHistory} from "react-router-dom";
import CartNavbar from "./inc/cartNavbar";
import {Badge} from "react-bootstrap";
import {useSelector, useDispatch} from "react-redux";
import {
    clearSpecAction,
    limitAction,
    logoutAction,
    maxPriceAction, minPriceAction,
    offsetAction,
    searchAction,
    sortAction
} from "../../store/actionCreators";
import {categoriesAPI, reminderCountAPI} from "../../http/api/product";

function Navbar({ currentUrl }) {
    const [categories, setCategories] = useState([])

    const [reminderCount, setReminderCount] = useState(0)

    const history = useHistory();

    const dispatch = useDispatch()

    const isAuth = useSelector(state => state.auth.isAuth)

    useEffect(()  => {
        categoriesAPI().then(response => {
            setCategories(response)
        })
    }, []);

    useEffect(()  => {
        reminderCountAPI().then(response => {
            setReminderCount(response.reminder_count)
        })
    }, [currentUrl]);

    let clearFilters = () =>{
        dispatch(offsetAction(0, 1))
        dispatch(limitAction(3))
        dispatch(sortAction('-id'))
        dispatch(searchAction(''))
        dispatch(minPriceAction(''))
        dispatch(maxPriceAction(''))
        dispatch(clearSpecAction())
    }

    let exit = () =>{
        dispatch(logoutAction())
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
        history.push('/')
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
                                    {categories.map(e =>(
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
                                    <React.Fragment>
                                        <li className="nav-item">
                                            <Link className="nav-link"
                                                  to={{pathname: `/login/`, fromDashboard: false}}>Авторизація</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link"
                                                  to={{pathname: `/registration/`, fromDashboard: false}}>Реєстрація</Link>

                                        </li>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <li className="nav-item">
                                            <Link className="nav-link"
                                                  to={{pathname: `/profile/`, fromDashboard: false}}>
                                                Профіль {
                                                reminderCount > 0 ?
                                                    <Badge className="badge bg-success">{ reminderCount }</Badge>
                                                    :
                                                    ""
                                            }
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <button className="btn btn-outline-secondary"
                                                    onClick={() => exit()}>Вихід
                                            </button>
                                        </li>
                                    </React.Fragment>
                            }

                        </ul>

                        {
                            isAuth ?
                                <React.Fragment>
                                    <Link style={{'textDecoration': 'none'}}
                                          to={{pathname: `/cart/`, fromDashboard: false}}><CartNavbar/>
                                    </Link>
                                </React.Fragment>
                                :
                                ""
                        }

                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;