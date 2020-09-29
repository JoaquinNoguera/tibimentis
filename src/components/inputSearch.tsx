import * as React from "react";
import { InputObject } from '../types/Input';
import SearchIcon from '../static/search.svg';
export default function useInputSearch( props  : React.HTMLAttributes<HTMLInputElement>) : InputObject {

  const [ value, setValue ] = React.useState<string>('');

  const input =           
                        <div className="search">
                          <input 
                              { ...props }
                              value={value}
                              onChange={e=> {
                                          setValue(e.target.value)
                              }}
                          />
                          <img src={SearchIcon} />
                        </div>

  return { value, setValue, input };
}