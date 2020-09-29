import * as React  from 'react';
import { auth, db } from '../firebase';
import Auth from './pages/auth';
import { StateContext } from './context/context';
import { actionTypes } from './context/reducer';
import Dashboard from './pages/dashboard';


const Backdoor : React.FunctionComponent = () => {

    const [ loading, setLoading] = React.useState<boolean>(true);
    const { state, dispatch } = React.useContext( StateContext );

    React.useEffect( () => {
        auth.onAuthStateChanged( ( user ) => {
            if( user )
                db.collection('autor').doc( user.uid ).get()
                    .then( doc => {
                            if(doc.exists){
                                const data = doc.data();
                                dispatch({
                                    type: actionTypes.LOGIN,
                                    payload: {
                                        id: user.uid,
                                        name: data.username 
                                    }
                                })
                            }
                            setLoading(false);
                });
            else{
                setLoading(false);
            }
        });
    }, []);
 
    if( loading ){
        return <div> Loading... </div>
    }else {
        if( state ){
            return (
                <Dashboard/>
            );
        }else{
            return(
                <Auth/>
            )
        }
    }
    
    
}

export default Backdoor;