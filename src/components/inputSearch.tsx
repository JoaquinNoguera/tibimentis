import * as React from "react";
import SearchIcon from '../static/search.svg';



export default function useInputSearch(  { onClick } : { onClick : Function} ) {

  const [ value, setValue ] = React.useState<string>('');

  const input =           
                        <div className="search">
                          <input 
                              value={value}
                              onKeyDown={ (e) => {
                                if( e.key === 'Enter'){
                                  onClick();
                                }
                              }}
                              onChange={e=> {
                                          setValue(e.target.value)
                              }}
                          />
                          <img src={SearchIcon} onClick={ () => onClick() } style={{ cursor: 'pointer' }}/>
                        </div>

  return { value, setValue, input };
}