import * as React from 'react';
import { 
    BrowserRouter,
    Switch,
    Route
} from 'react-router-dom';
import { StateProvider} from '../backdoor/context/context';
import Backdoor from '../backdoor';
import './styles.scss';

const App : React.FunctionComponent = () => {
    return(
        <BrowserRouter>
            <Switch>
                <StateProvider>
                    <Route path="/backdoor" component={ Backdoor } />
                </StateProvider>
            </Switch>
        </BrowserRouter>
    );
}

export default App;