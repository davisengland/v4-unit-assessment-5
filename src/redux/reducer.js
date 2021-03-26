const initialState = {
    username: '',
    profile_pic: ''
}

const ACTION_TYPE = 'ACTION_TYPE'
const ACTION_LOGOUT = 'ACTION_LOGOUT'

export function updateUser(user) {
    return {
        type: ACTION_TYPE,
        payload: user
    }
}

export function logout() {
    return {
        type: ACTION_LOGOUT
    }
}

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case ACTION_TYPE:
            return {
                ...state,
                username: action.payload.user.username,
                profile_pic: action.payload.user.profile_pic
            }
        case ACTION_LOGOUT:
            return initialState
        default: return state
    }
}