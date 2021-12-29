import { LOGIN, EXIT } from "../actions";

const initialState = {
    username: '',
    isAuth: false
}

export function authReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return { ...state, username: action.payload, isAuth: true }
        case EXIT:
            localStorage.removeItem('token')
            localStorage.removeItem('refresh')
            return { ...state, username: '', isAuth: false }
        default:
            return state
    }
}