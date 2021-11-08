import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function NavBar(props) {

    return (
        <div>
            <nav className="nav nav-pills nav-justified">
                <Link className={`nav-item nav-link ${window.location.pathname.startsWith('/product/') ? 'active' : ''}`}
                      to={{pathname: `/product/${props.productSlug}`, fromDashboard: false}}>Головне</Link>
                <Link className={`nav-item nav-link ${window.location.pathname.startsWith('/specification/') ? 'active' : ''}`}
                      to={{pathname: `/specification/${props.productSlug}`, fromDashboard: false}}>Характеристики</Link>
                <Link className={`nav-item nav-link ${window.location.pathname.startsWith('/review/') ? 'active' : ''}`}
                      to={{pathname: `/review/${props.productSlug}`, fromDashboard: false}}>Відгуки</Link>
            </nav>
        </div>
    );
}

export default NavBar;