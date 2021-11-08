import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import {loginUrl } from "../router/urls";
import {useAuth} from "../../hooks/useAuth";
import {activeUserAPI} from "../../http/api/auth";


function Activation({ match }) {
    const uid = match.params.uid
    const token = match.params.token
    const data = {username: localStorage.getItem('username'), password: localStorage.getItem('password')}
    const auth = useAuth()

    useEffect(()  => {
        activeUserAPI(uid, token).then(() =>{
            console.log('ACTIVATED')
        })
    }, []);

    let login = () =>{
        auth.auth(data, loginUrl, '/')
        localStorage.removeItem('username')
        localStorage.removeItem('password')
    }

    return (
        <div className="App">
            <a className="btn btn-danger" onClick={login}>Увійти</a>
        </div>
    );
}

export default Activation;
