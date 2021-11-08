import {LIMIT, OFFSET, SORT, SEARCH, MIN_PRICE, MAX_PRICE, REMOVE_SPEC, ADD_SPEC, CLEAR_SPEC} from "../actions";

const initialState = {
    limit: 3,
    offset: 0,
    currentPage: 1,
    sort: '-id',
    search: '',
    minPrice: '',
    maxPrice: '',
    specifications: []
}

export function filterProductReducer(state=initialState, action){
    switch (action.type) {
        case LIMIT:
            return {...state, limit: action.payload}
        case OFFSET:
            return {...state, offset: action.offset, currentPage: action.currentPage}
        case SORT:
            return {...state, sort: action.payload}
        case SEARCH:
            return {...state, search: action.payload}
        case MIN_PRICE:
            return {...state, minPrice: action.payload}
        case MAX_PRICE:
            return {...state, maxPrice: action.payload}
        case ADD_SPEC:
            return {...state, specifications: state.specifications.concat(action.payload)}
        case REMOVE_SPEC:
            return {...state, specifications: state.specifications.filter(spec => spec !== action.payload)}
        case CLEAR_SPEC:
            return {...state, specifications: []}
        default:
            return state
    }
}