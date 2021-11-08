import { loginAction } from "../store/actionCreators";
import { useDispatch } from "react-redux";
import { authAPI } from "../http/api/auth";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { loginUrl, registrationUrl } from "../components/router/urls";


export function useAuth() {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const history = useHistory();

    const auth = (e, url, redirect) => {
        setLoading(true)
        console.log(e)
        authAPI(url, e).then(res => {
            switch (url) {
                case loginUrl:
                    dispatch(loginAction(e.username))
                    localStorage.setItem('token', res.access)
                    localStorage.setItem('refresh', res.refresh)
                    history.push(redirect)
                    return
                case registrationUrl:
                    console.log(1)
                    localStorage.setItem('username', e.username)
                    localStorage.setItem('password', e.password)
                    history.push(redirect)
                    return
            }
        }).catch(() => {
            setLoading(false)
        })
    }
    return {
        auth, loading
    }
}
