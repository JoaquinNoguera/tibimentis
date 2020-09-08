import * as React from 'react';
import { 
    Switch,
    Route, 
    useLocation
} from 'react-router-dom';
import logoIcon from '../../../static/logo.svg';
import Login from './pages/login';
import Singin from './pages/singin';
import Recover from './pages/recover';
import { 
        animated,
        useTransition 
} from 'react-spring';
import './styles.scss';



const Auth : React.FunctionComponent = () => {

    const location = useLocation();

    const transitions = useTransition( location, location => location.pathname, {
        from: {
            opacity: 0,
            transform: 'translate( 0, -100% )',
            position: 'fixed'
        },
        enter:{
            opacity: 1,
            transform: 'translate( 0, 0% )',
            position: 'static'
        },
        leave:{
            opacity: 0,
            transform: 'translate( 0, 50% )',
            position: 'fixed'
        }
    }) 


    return(
        <div id='auth'>
            {
                transitions.map( ({ item, props, key}) => (
                    <animated.div key={key} style={props} id='auth__container'>
                        <img src={ logoIcon } className='auth__logo' />
                        <Switch location={ item }>
                            <Route exact path='/backdoor/registrarse' component={ Singin }/>
                            <Route exact path='/backdoor/recuperar' component={ Recover }/>
                            <Route component={ Login } />
                        </Switch>
                    </animated.div>
                ))
            }
        </div>
    );
}

export default Auth;