import { createStore, combineReducers } from 'redux';
import { loadState, saveState } from "./localStorage";

// reducers
import { authReducer } from "./reducers/auth";
import { filterProductReducer } from "./reducers/filterProduct";
import { reminderReducer } from './reducers/reminder';

const rootReducer = combineReducers({
    auth: authReducer,
    filterProduct: filterProductReducer,
    reminder: reminderReducer
})

const persistedStore = loadState();

export const store = createStore(rootReducer, persistedStore,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

store.subscribe(() =>
    saveState(store.getState())
)
