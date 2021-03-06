import * as React from 'react';
import { 
        Switch, 
        Route, 
        useLocation 
} from 'react-router-dom';
import { 
    animated,
    useTransition 
} from 'react-spring';
import NotFound from '../components/404';
import Home from './pages/home';
import Navbar from './components/navbar';
import Story from './pages/story';
import './styles.scss';

const Principal = () => {

    const location = useLocation();
    
    const transitions = useTransition( location, location => location.pathname, {
        from: {
            opacity: 0,
            position: 'absolute'
        },
        enter:{
            opacity: 1,
            position: 'static'
        },
        leave:{
            opacity: 0,
            position: 'absolute'
        }
    }) 

    return  <div id="principal">
             {
                transitions.map( ({ item, props, key}) => (
                    <animated.div 
                        className="wraperDashboard" 
                        style={ props }
                        key={key}
                    >
                    <Navbar/>
                    <Switch location={item}>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/historia/:id" component={ Story }/>
                        <Route component={NotFound}/>
                    </Switch>
                    </animated.div>
                ))
            }
            </div>
}

export default Principal;