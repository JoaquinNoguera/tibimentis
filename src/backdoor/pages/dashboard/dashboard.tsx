import * as React from 'react';
import HeaderDashboard from './components/header-dashboard';
import { 
    Switch, 
    Route, 
    useLocation
} from 'react-router-dom';
import NotFound from '../../../components/404';
import ControlPanel from './pages/control-panel';
import NewStory from './pages/new-story';
import { 
    animated,
    useTransition 
} from 'react-spring';
import './styles.scss';

const Dashboard= () => {

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

    return (
        <>
            {
                transitions.map( ({ item, props, key}) => (
                <animated.div 
                    className="wraperDashboard" 
                    style={ props }
                    key={key}
                >
                    <HeaderDashboard/>
                    <Switch location={item}>
                        <Route exact path='/backdoor/' component={ ControlPanel }/>
                        <Route exact path='/backdoor/new' component={ NewStory }/>
                        <Route exact path='/backdoor/story/:id' />
                        <Route component={ NotFound }/>
                    </Switch>
                </animated.div>
                ))
            }
        </>
    )
}

export default Dashboard;
