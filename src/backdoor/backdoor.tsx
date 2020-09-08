import * as React  from 'react';
import { auth } from '../firebase';
import { User } from 'firebase';
import Auth from './pages/auth';
import Dashboard from './pages/dashboard';


const Backdoor : React.FunctionComponent = () => {

    const [ loading, setLoading] = React.useState<boolean>(true);
    const [ user , setUser ] = React.useState<User>(null);

    React.useEffect( () => {
        auth.onAuthStateChanged( ( user ) => {
            if( user )
                setUser(user);
            setLoading(false);
        });
    }, []);


    // auth.signOut().then();

    if( loading ){
        return <div> Loading... </div>
    }else {
        if( user ){
            return (
                <Dashboard id={ user.uid } />
            );
        }else{
            return(
                <Auth/>
            )
        }
    }
    
    
}

export default Backdoor;