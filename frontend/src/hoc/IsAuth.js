import React from 'react'
import { useLocation, Redirect } from "react-router-dom";
import { useSelector } from "react-redux"

export function IsAuth({ children }) {
    const isAuth = useSelector(state => state.auth.isAuth)

    console.log(isAuth)

    if (!isAuth) {
        return <Redirect to='/login' />
    }
    return children;
}
