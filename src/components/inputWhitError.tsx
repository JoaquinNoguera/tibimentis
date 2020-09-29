import * as React from "react";
import { 
    animated,
    useSpring 
} from 'react-spring';
import { InputObject } from '../types/Input';

interface inputPropsType extends React.HTMLAttributes<HTMLInputElement> {
    type: string,
    required: boolean
}

interface InputProps{
    init : string,
    otherProps: inputPropsType,
    message: string,
    error: boolean,
    name: string
}

export default function useInputWithError(
    {
        init,
        message,
        error,
        name,
        otherProps 
    }  : InputProps ) : InputObject {

    
    const animSpan = useSpring({
        config:{
            duration: 100
        },
        from: {
            height: '0px'
        }, 
        to:{
            height: `${( error ? '16px' : '0px')}`
        }
    });

    const animInput = useSpring({
        config:{
            duration: 100
        },
        from: {
            color: '#222222',
            border: '1px solid grey'
        },
        to: {
            color: `${ error ? '#d72323' : '#222222'}`,
            border: `${ error ? '1px solid #d72323' : '1px solid grey'}`
        }
    });

  
    const [ value, setValue ] = React.useState<string>(init);

    
    const input =   <label className='input'>
                        { name }
                        <animated.input 
                            { ...otherProps }
                            style={ animInput }
                            value={value}
                            onChange={e=> {
                                            setValue(e.target.value)
                            }}
                        />
                        <animated.span style={animSpan} className='spanError'>
                            { message }
                        </animated.span>
                    </label>

  return { value, setValue, input } 
}