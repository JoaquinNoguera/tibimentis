import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {useSpring, animated} from 'react-spring';
import './styles.scss';

type PopupProps = {
    children: any,
    showPopup: boolean,
    tooglePopup: Function
};
const Popup = ( props : PopupProps) => {

    const [pointerDownStartedHere, setPointerDownStartedHere] = React.useState<boolean>(false);
    const { showPopup, tooglePopup, children } = props; 



    const style = useSpring({
            opacity: showPopup ? 1 : 0, 
            top: showPopup ? '0' : '-100%',
    });




    return ReactDOM.createPortal((
        <animated.div 
            id="popup__wrapper" 
            style={style}
            onPointerDown={ event => { 
                event.stopPropagation();
                setPointerDownStartedHere(true); 
            }}
            onClick={ event => { 
                event.stopPropagation(); 
                if (   pointerDownStartedHere ) {
                    tooglePopup();
                }
                setPointerDownStartedHere(false);
            }}
        >

            <div 
                id="popup" 
                style={ style } 
                onClick={ event => event.stopPropagation() }
                onPointerDown={ event => event.stopPropagation() }
            > 
                { children }
            </div>
        </animated.div>), 
        document.getElementById('popup-root'));
}

export default Popup;