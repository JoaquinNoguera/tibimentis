import * as React from 'react';
import { 
    BrowserRouter,
    Switch,
    Route
} from 'react-router-dom';
import { StateProvider} from '../backdoor/context/context';
import Backdoor from '../backdoor';
import Principal from '../principal';
import './styles.scss';

const App : React.FunctionComponent = () => {
    return(
        <BrowserRouter>
                <Switch>
                    <Route path="/backdoor" component={ () =>  <StateProvider> <Backdoor/> </StateProvider> } />
                    <Route component={ Principal } />
                </Switch>
        </BrowserRouter>
    );
}

export default App;