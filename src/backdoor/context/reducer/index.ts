export type User = {
    name : string,
    id : string
}

type reducerActions = {
    type : actionTypes,
    payload: User
}

export enum actionTypes {
    LOGIN,
    LOGOUT,
    CHANGE_NAME
}

export const initialState : User = null;

const userReducer = ( state : User , { type, payload } : reducerActions ) : User => {
    
    switch(type){
        case actionTypes.LOGIN: {
            return {
                name: payload?.name,
                id: payload?.id
            }
        }
        
        case actionTypes.LOGOUT: {
            return initialState;
        }

        case actionTypes.CHANGE_NAME: {
            return {
                ...state,
                name: payload?.name
            }

        }
        default: {
            return state;
        }
    }
}

export default userReducer;