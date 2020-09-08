import * as React from "react";


interface inputPropsType extends React.HTMLAttributes<HTMLInputElement> {
    type: string,
    required: boolean
}


interface InputProps{
    init : string,
    name: string,
    otherProps: inputPropsType
}
interface InputObject {
    value : string,
    setValue: Function,
    input : JSX.Element
}

export default function useInput(
    {
        init, 
        name,
        otherProps 
    }  : InputProps ) : InputObject {

  const [ value, setValue ] = React.useState<string>(init);

  const input =    <label className='input'>
                        { name }
                        <input 
                            { ...otherProps }
                            value={value}
                            onChange={e=> {
                                        setValue(e.target.value)
                            }}
                        />
                    </label> 

  return { value, setValue, input };
}