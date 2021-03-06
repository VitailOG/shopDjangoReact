import axios from "axios";
import { baseUrl, refreshToken } from "../components/router/urls";
import { store } from "../store/store";
import { logoutAction } from "../store/actionCreators";

const $axios = axios.create({
    baseURL: baseUrl,
    withCredentials: true
});

$axios.interceptors.request.use((config) => {
    if (localStorage.getItem('token')) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    }

    return config;
})

$axios.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            await axios.post(refreshToken,
                { refresh: localStorage.getItem('refresh') }, { withCredentials: true })
                .then(response => localStorage.setItem('token', response.data.access))
            return $axios.request(originalRequest)
        } catch (e) {
            console.log(e)
            store.dispatch(logoutAction())
            localStorage.removeItem('token')
            localStorage.removeItem('refresh')
        }
    }
    throw error;
})

export default $axios;