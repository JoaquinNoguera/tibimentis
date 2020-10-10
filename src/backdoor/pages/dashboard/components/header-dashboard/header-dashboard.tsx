import * as React from 'react';
import { db, auth } from '../../../../../firebase';
import {useSpring, animated} from 'react-spring';
import UserIcon from '../../../../../static/user.svg';
import { StateContext } from '../../../../context/context';
import { actionTypes } from '../../../../context/reducer';
import Popup from '../../../../../components/popup';
import Spinner from '../../../../../components/spinner';
import useInputWhitError from '../../../../../components/inputWhitError';
import './styles.scss';

const HeaderDashboard = () => {

    const [ show, toogleShow ] = React.useState<boolean>(false);
    const [ popup, setPopup ] = React.useState<boolean>(false);
    const [ changeNameError, toooglechangeNameError ] = React.useState<boolean>(false);
    const [ loading, toogleLoading ] = React.useState<boolean>(false);
    
    const { state, dispatch } = React.useContext( StateContext );
    const dropdownProps = useSpring({
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
    });
    
    const wrapperRef = React.useRef( null );
    const buttonRef = React.useRef( null );
    
    React.useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const handleClickOutside = ( event : MouseEvent ) => {
        if (    wrapperRef.current && 
                !wrapperRef.current.contains(event.target) &&
                buttonRef.current && 
                !buttonRef.current.contains(event.target)    
        )    toogleShow(false);
    }

    const usernameInput = useInputWhitError({
        init:'',
        name: 'Nombre de usuario',
        error: changeNameError,
        message: "Lo sentimos, ha ocurrido un error, por favor intentelo otra vez",
        otherProps: {
            type: 'text',
            required: true,
            placeholder: 'Nombre de Usuario',
        }
    });

    React.useEffect(()=>{
        if(changeNameError) toooglechangeNameError(false);
    },[usernameInput.value]);

    const tooglePopup = () => {
        setPopup(!popup);
        usernameInput.setValue('');
    }
    
    const changeName = () => {
        toogleLoading(true);
        db.runTransaction(  async ( transaction ) => {
            
            const autorRef = db.collection('autor').doc( state.id );
            transaction.update( autorRef, "username", usernameInput.value );

            const stories = await db   .collection('Story')
                                            .where("userId","==",state.id)
                                            .get();

            stories.forEach( s => transaction.update( s.ref , "autorName" , usernameInput.value ));
        }).then( () => {
            dispatch({
                type: actionTypes.CHANGE_NAME,
                payload: {
                    name: usernameInput.value
                }
            });
            toogleLoading( false );
            tooglePopup();
        }).catch( () => {
            toooglechangeNameError( true );
            toogleLoading(false);   
        });
    }

    return(
        <>
        <div id="headerDashboard">
            <div className="haderDashboard--rigth">
                <span>
                    { state.name }
                </span>
                <img 
                    onClick={() =>{
                        toogleShow(!show);
                    }} 
                    ref={buttonRef}
                    src={UserIcon}
                />
                <animated.div  
                    style={dropdownProps} 
                    className="dropdown"
                    ref={wrapperRef}
                >
                    <div 
                        className="option"
                        onClick={() => {
                            tooglePopup()
                            toogleShow(!show)  
                        }}
                    >
                        Cambiar nombre de usuario
                    </div>
                    <div 
                        className="option"
                        onClick={ ()=> auth.signOut().then( 
                                    () => dispatch({ type: actionTypes.LOGOUT })) 
                        }
                    >
                        Cerrar Sesión
                    </div>
                </animated.div>
            </div>
      
        </div>
    
        <Popup
            showPopup={popup}
            tooglePopup={tooglePopup}

        >
            <form 
                className="headerDashboard--popup"
                onSubmit={ ( e : React.FormEvent<HTMLFormElement>  ) => { 
                    e.preventDefault();
                    changeName();
                }}
            >
                <h2> Ingrese el nuevo nombre </h2>
                { usernameInput.input }
                <div
                    className="popup--buttonoptions"
                >


                    <button
                        className="button__primary"
                        disabled={ !popup }
                       type='submit'
                    >
                        Cambiar
                    </button>
                    <button
                        type='button'
                        className="button__error"
                        onClick={tooglePopup}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Popup>
        { loading && <Spinner/> }
        </>
    );
}

export default HeaderDashboard;