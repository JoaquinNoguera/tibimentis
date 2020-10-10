import * as React from "react";
import './styles.scss'



export default function useToogle(  { status } : { status : boolean} ) {
  const [ value, setValue ] = React.useState<boolean>( status );
  const input =    
                    <label className="switch">
                        <input 
                            type="checkbox"
                            checked={ value }
                            onChange={e=> {
                                          setValue( e.target.checked )
                            }}
                        />
                        <span className="slider round"></span>
                    </label>  

  return { value, setValue, input };
}