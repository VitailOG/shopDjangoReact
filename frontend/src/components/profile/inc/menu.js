import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function Menu() {
    return (
        <div className="App">
            <div className="nav flex-column nav-pills mt-4" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <Link className={`nav-link mx-5 ${window.location.pathname === '/profile/' ? 'active' : ''}`}
                to={{ pathname: `/profile/`, fromDashboard: false }}
                >Замовлення
                </Link>
                <Link className={`nav-link mx-5 ${window.location.pathname === '/in-pending/' ? 'active' : ''}`}
                to={{ pathname: `/in-pending/`, fromDashboard: false }}
                >В очікуванні
                </Link>
            </div>
        </div>
    );
}

export default Menu;