import * as React from "react";


interface textareaPropsType extends React.HTMLAttributes<HTMLTextAreaElement> {
    type: string,
    required: boolean
}


interface textareaProps{
    init : string,
    name: string,
    otherProps: textareaPropsType
}
interface textareaObject {
    value : string,
    setValue: Function,
    textarea : JSX.Element
}

export default function usetextarea(
    {
        init, 
        name,
        otherProps 
    }  : textareaProps ) : textareaObject {

  const [ value, setValue ] = React.useState<string>(init);

  const textarea =    <label className='textarea'>
                        { name }
                        <textarea 
                            { ...otherProps }
                            value={value}
                            onChange={e=> {
                                        setValue(e.target.value)
                            }}
                        />
                    </label> 

  return { value, setValue, textarea };
}