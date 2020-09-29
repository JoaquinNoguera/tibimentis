import * as React from 'react';
import userReducer, { initialState, User } from '../reducer';

const StateContext = React.createContext<{
    state: User,
    dispatch: React.Dispatch<any>
}>({
    state: initialState,
    dispatch: () => null
});


const StateProvider : React.FC = ({ children }) => {
    const [ state, dispatch ] = React.useReducer(userReducer, initialState);
    return (
        <StateContext.Provider value ={{ state, dispatch }}> 
            { children }
        </StateContext.Provider>
    );
}

export {
    StateProvider,
    StateContext
};