import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import CustomBadge from "../../navigation/inc/customBadge"
import { useSelector } from "react-redux";

function Menu() {

    const reminderCount = useSelector(state => state.reminder.countReminder)

    return (
        <div className="App">
            <div className="nav flex-column nav-pills mt-4" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <Link className={`nav-link mx-5 ${window.location.pathname === '/profile/' ? 'active' : ''}`}
                    to={{ pathname: `/profile/`, fromDashboard: false }}
                >Замовлення
                </Link>
                <Link className={`nav-link mx-5 ${window.location.pathname === '/in-pending/' ? 'active' : ''}`}
                    to={{ pathname: `/in-pending/`, fromDashboard: false }}
                >В очікуванні <CustomBadge reminderCount={reminderCount} />
                </Link>
            </div>
        </div>
    );
}

export default Menu;