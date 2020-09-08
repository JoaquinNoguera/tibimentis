import * as React from 'react';
import { Link } from 'react-router-dom';
import {
    auth
} from '../../../../../firebase/index';
import useInputWhitError from '../../../../../components/inputWhitError';
const Login = () => {

    
    const [emailError, tooogleEmailError ] = React.useState<boolean>(false);
    const [passwordError, tooglePasswordError ] = React.useState<boolean>(false); 

    const emailInput = useInputWhitError({
        init:'',
        name: 'Correo',
        message: 'No se ha reconocido el correo ingresado',
        error: emailError,
        otherProps: {
            type: 'email',
            required: true,
            placeholder: 'example@email.com'
        }
    });
    

    const passwordInput = useInputWhitError({
        init:'',
        name: ' Contraseña',
        message: 'Contraseña ingresada incorrecta',
        error: passwordError,
        otherProps: {
            type: 'password',   
            required: true,
            placeholder: '******'
        }
    });


    React.useEffect(()=>{
        if(emailError) tooogleEmailError(false);
    },[emailInput.value]);

    React.useEffect(()=>{
        if(passwordError) tooglePasswordError(false);
    },[passwordInput.value]);


    const login = () => {
        auth.signInWithEmailAndPassword( emailInput.value, passwordInput.value)
            .then()
            .catch( ({ code }) => {
                switch(code){
                    case 'auth/user-not-found':{
                        tooogleEmailError(true);
                        break;
                    }
                    case 'auth/wrong-password': {
                        tooglePasswordError(true);
                        break;
                    }
                    default: {
                        console.log(code);
                    }
                }
            });
    }


  
    return(
        <form className='auth__form' onSubmit={    ( e : React.FormEvent<HTMLFormElement>  ) => { 
            e.preventDefault();
            login();
        }}>
            <h1> 
                Ingresar 
            </h1>
       
            { emailInput.input }
           
            { passwordInput.input }
         
                
            <button
                type="submit"
                className='button__primary'
            >
                Ingresar 
            </button>
                
            <div
                className="auth__links"
            >
                <Link to='/backdoor/registrarse'>
                    Crear Cuenta
                </Link>
            
                <Link to='/backdoor/recuperar'>
                        Recuperar Contraseña
                </Link>
            </div>
        </form>   
    )
}



export default Login;