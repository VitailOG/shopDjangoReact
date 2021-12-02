import { REMINDER, UPDATE_REMINDER, CLEAR_REMINDER } from "../actions";

const initialState = {
    countReminder: 0
}

export function reminderReducer(state = initialState, action) {
    switch (action.type) {
        case REMINDER:
            return { ...state, countReminder: action.payload }
        case UPDATE_REMINDER:
            return { ...state, countReminder: state.countReminder + action.payload }
        case CLEAR_REMINDER:
            return { ...state, countReminder: 0 }
        default:
            return state
    }
}
