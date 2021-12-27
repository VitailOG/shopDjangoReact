import React from 'react';
import {Link} from "react-router-dom";

function BreadCrumb({ setOpenPage, openPage, nameCategory }) {

    return (
        <nav className="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link style={{ 'textDecoration': 'none' }}
                          to={{ pathname: `/`, fromDashboard: false }}>Домашня</Link>
                </li>
                <li className="breadcrumb-item active"
                    onClick={() => setOpenPage(!openPage)}
                    aria-current="page">{nameCategory}</li>
            </ol>
        </nav>
    );
}

export default React.memo(BreadCrumb);
