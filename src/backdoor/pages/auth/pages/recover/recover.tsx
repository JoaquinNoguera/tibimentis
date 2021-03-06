import * as React from 'react';
import { Link } from 'react-router-dom';
import {
    auth
} from '../../../../../firebase/index';
import Spinner from '../../../../../components/spinner';
import useInputWhitError from '../../../../../components/inputWhitError';


const Recover : React.FunctionComponent = () => {

    const [emailError, tooogleEmailError ] = React.useState<boolean>(false);
    const [loading, toogleLoading ] = React.useState<boolean>(false);

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

    React.useEffect(()=>{
        if(emailError) tooogleEmailError(false);
    },[emailInput.value]);

    const recover = () => {
        toogleLoading(true);
        auth.sendPasswordResetEmail(emailInput.value).then(function() {
            emailInput.setValue('');
            toogleLoading(false);
          }).catch(function(error) {
            tooogleEmailError(true);
            toogleLoading(false);
          });
    }


    return (
        <form className='auth__form' onSubmit={    ( e : React.FormEvent<HTMLFormElement>  ) => { 
            e.preventDefault();
            recover();
        }}>
            { loading && <Spinner/> }
            <h1>
                Recuperar Contraseña
            </h1>
            <p> 
                Se le enviará un mail a su cuenta de correo para que pueda recuperar 
                la contraseña 
            </p>
            
            { emailInput.input }

            <button
                type="submit"
                className='button__primary'
            >
                Enviar
            </button>

            <div
                className="auth__links"
            >
                <Link to='/backdoor/'>
                    Ingresar
                </Link>
            </div>

        </form>

    )
}

export default Recover;