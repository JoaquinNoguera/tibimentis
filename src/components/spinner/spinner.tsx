import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './styles.scss';

const Spinner = ( ) => {
    return ReactDOM.createPortal((
            <div 
                id="spinner" 
            > 
                <svg>
                    <rect/>
                </svg>
            </div>
), 
        document.getElementById('popup-root'));
}

export default Spinner;