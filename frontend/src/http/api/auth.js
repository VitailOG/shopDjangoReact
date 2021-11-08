import axios from "../index";
import $axios from "../index";
import {getAllOrdersCustomer, userActivated} from "../../components/router/urls";

export function authAPI(url, e){
    return axios.post(url, e).then(response => response.data)
}

export function activeUserAPI(uid, token){
    return axios.post(userActivated, {uid: uid, token: token})
}

export function profileAPI(ordering) {
    return $axios({
        method: "GET",
        url: getAllOrdersCustomer,
        params: {ordering: ordering}
    }).then(response => response.data)
}

