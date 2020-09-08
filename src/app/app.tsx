import * as React from 'react';
import { 
    BrowserRouter,
    Switch,
    Route
} from 'react-router-dom';
import Backdoor from '../backdoor';
import './styles.scss';

const App : React.FunctionComponent = () => {
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/backdoor" component={ Backdoor } />
            </Switch>
        </BrowserRouter>
    );
}

export default App;