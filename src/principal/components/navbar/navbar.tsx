import * as React from 'react';
import logoIcon from '../../../static/logo.svg';
import { Link } from 'react-router-dom'
import './styles.scss';

const Navbar = () => {
    return(
        <div
            id="navbar"
        >
            <div
                className="navbar__left"
            >
                
                <Link to="/">
                    <img src={logoIcon}/>
                    Tibimentis
                </Link>
            </div>
        </div>
    );
}

export default Navbar;