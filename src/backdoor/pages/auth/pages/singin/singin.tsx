import * as React from 'react'; 
import {
    Link
} from 'react-router-dom';
import {
    auth, 
    db
} from '../../../../../firebase/index';
import Spinner from '../../../../../components/spinner';
import useInput from '../../../../../components/input';
import useInputWithError from '../../../../../components/inputWhitError';
import Popup from '../../../../../components/popup';


const Singin : React.FunctionComponent = () => {


    const [emailError, tooogleEmailError ] = React.useState<boolean>(false);
    const [passwordError, tooglePasswordError ] = React.useState<boolean>(false); 
    const [codeError, toogleCodeError ] = React.useState<boolean>(false);
    const [loading, toogleLoading ] = React.useState<boolean>(false);
    const [popup, tooglePopup ] = React.useState<boolean>(false);
   
    const usernameInput = useInput({
        init:'',
        name: 'Nombre de usuario',
        otherProps: {
            type: 'text',
            required: true,
            placeholder: 'Nombre de Usuario',
        }
    });
 
    const emailInput = useInputWithError({
        init:'',
        name: 'Correo Electronico',
        message: 'El correo ingresado ya está registrado',
        error: emailError,
        otherProps: {
            type: 'email',
            required: true,
            placeholder: 'example@email.com'
        }
    });
    
    const passwordInput = useInputWithError({
        init:'',
        name: 'Contraseña',
        message: 'La contraseña debe tener al menos 6 carácteres',
        error: passwordError,
        otherProps: {
            type: 'password',
            required: true,
            placeholder: '******'
        }
    });
    

    const codeInput = useInputWithError({
        init:'',
        name: 'Código',
        error: codeError,
        message: 'El código ingresado es incorrecto',
        otherProps: {
            type: 'text',
            required: true,
            placeholder: 'A4G2B9'
        }
    });
   

    React.useEffect(()=>{
        if(emailError) tooogleEmailError(false);
    },[emailInput.value]);

    React.useEffect(()=>{
        if(passwordError) tooglePasswordError(false);
    },[passwordInput.value]);

    React.useEffect(()=>{
        if(codeError) toogleCodeError(false);
    },[codeInput.value]);

    const singin = async () => {
    try{
        if( passwordInput.value.length >= 6){
                const result = await db.collection('code').where( "value" , "==" , codeInput.value ).get();
            if( result.docs.length ){
                toogleLoading(true);
                const { user } = await auth.createUserWithEmailAndPassword( emailInput.value, passwordInput.value );
                
                await user.sendEmailVerification();

                await db.collection('autor').doc( user.uid ).set({
                    username: usernameInput.value
                });
                tooglePopup( true );
                toogleLoading(false);
                }else{
                    toogleLoading(false);
                    toogleCodeError(true);
            }
        }else {
            
            toogleLoading(false);
            tooglePasswordError(true);    
        }
    }catch( error ){
        toogleLoading(false);
        tooogleEmailError(true);
    }}


    return (
        <>
        <form className='auth__form' onSubmit={    ( e : React.FormEvent<HTMLFormElement>  ) => { 
                                            e.preventDefault();
                                            singin();
                                        }  
        }>
            { loading && <Spinner/> }
            <h1> Registrarse </h1>
            
            { usernameInput.input }
        
            { emailInput.input }
        
            { passwordInput.input }
            
            { codeInput.input }
            
            <button
                type='submit'
                className='button__primary'
            >
                Registrarse
            </button>
            
            <div
            className="auth__links"
            >
            <Link to='/backdoor/'>
                Ya Tengo Cuenta
            </Link>
            </div>
        </form>   
        <Popup
            showPopup={ popup }
            tooglePopup={ () => tooglePopup( false ) }
        >
            <h2 className="popup-h2">
                    La cuenta ha sido creada con exito
            </h2>
            <div className="button_wrapper">
                <button 
                    className="button__primary"
                    onClick={ () => tooglePopup( false ) }
                    > Aceptar 
                </button>
            </div>
        </Popup>
        </>
        
    );
}

export default Singin;