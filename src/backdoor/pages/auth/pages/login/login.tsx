import * as React from 'react';
import { Link } from 'react-router-dom';
import {
    auth
} from '../../../../../firebase/index';
import Spinner from '../../../../../components/spinner';
import useInputWhitError from '../../../../../components/inputWhitError';
const Login = () => {

    
    const [emailError, tooogleEmailError ] = React.useState<boolean>(false);
    const [passwordError, tooglePasswordError ] = React.useState<boolean>(false); 
    const [ tooManyError, toogleTooMany ] = React.useState<boolean>(false); 
    const [ loading, toogleLoading ] = React.useState<boolean>(false);

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
        toogleLoading(true);
        auth.signInWithEmailAndPassword( emailInput.value, passwordInput.value)
            .then()
            .catch( ({ code }) => {
                switch(code){
                    case 'auth/user-not-found':{
                        tooogleEmailError(true);
                        toogleLoading(false);
                        break;
                    }
                    case 'auth/wrong-password': {
                        tooglePasswordError(true);
                        toogleLoading(false);
                        break;
                    }
                    case 'auth/too-many-requests': {
                        toogleTooMany(true);
                        toogleLoading(false);
                        break;
                    }
                    default: {
                         toogleLoading(false);
                    }
                }
            });
    }


  
    return(
        <form className='auth__form' onSubmit={    ( e : React.FormEvent<HTMLFormElement>  ) => { 
            e.preventDefault();
            login();
        }}>
            { loading && <Spinner/> }
            <h1> 
                Ingresar 
            </h1>
       
            { emailInput.input }
           
            { passwordInput.input }
            {
                tooManyError &&
                <span
                className='spanError'
                >
                Lo sentimos ha ingresado demasiadas veces mal las credenciales, pruebe devuelta en unos minutos
                </span>
            }
            
                
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