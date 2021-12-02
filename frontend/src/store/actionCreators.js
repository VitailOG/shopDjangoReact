import {
    LOGIN,
    EXIT,
    LIMIT,
    OFFSET,
    SORT,
    SEARCH,
    MAX_PRICE,
    MIN_PRICE,
    ADD_SPEC,
    REMOVE_SPEC,
    CLEAR_SPEC,
    REMINDER,
    UPDATE_REMINDER,
    CLEAR_REMINDER
} from "./actions";

// auth
export const loginAction = username => ({ type: LOGIN, payload: username })
export const logoutAction = () => ({ type: EXIT })

// filter product
export const limitAction = limit => ({ type: LIMIT, payload: limit })
export const offsetAction = (offset, currentPage) => ({ type: OFFSET, offset: offset, currentPage: currentPage })
export const sortAction = sort => ({ type: SORT, payload: sort })
export const searchAction = search => ({ type: SEARCH, payload: search })
export const minPriceAction = minPrice => ({ type: MIN_PRICE, payload: minPrice })
export const maxPriceAction = maxPrice => ({ type: MAX_PRICE, payload: maxPrice })
export const addSpecAction = spec => ({ type: ADD_SPEC, payload: spec })
export const removeSpecAction = spec => ({ type: REMOVE_SPEC, payload: spec })
export const clearSpecAction = () => ({ type: CLEAR_SPEC })

// filter product
export const updateCountReminderCustomer = count => ({ type: UPDATE_REMINDER, payload: count })
export const countReminderCustomer = count => ({ type: REMINDER, payload: count })
export const clearCountReminderCustomer = () => ({ type: CLEAR_REMINDER })
