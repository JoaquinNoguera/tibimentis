import * as React from 'react';
import { Story } from '../../../models/Story';
import { storage } from '../../../firebase';
import { useHistory } from 'react-router-dom';
import './styles.scss';

const StoryCard = ( { title, content, autorName, image, id  } : Story ) => {
   
    const [ url, setUrl ] = React.useState<string>('');
    const [ loading, toogleLoading ] = React.useState<boolean>(true);
    const imageRef = storage.ref().child('images');
    const history = useHistory();
    
    const getImage = () => {
        if( image ){
            imageRef.child( image ).getDownloadURL().then( url => {
                setUrl(url);
                toogleLoading(false);
            }).catch(error => {
                console.log(error)
            })
        } 
    }

    const onClick = () => {
        scrollTo(0,0);
        history.push(`/historia/${id}`)
    }


    React.useEffect(()=>{
        getImage();
    },[]);

    const renderImage = () => {
        return ( loading ) ? <div className="card__imgLoading" /> : <div className="card__img" style={{ backgroundImage: `url(${url})` }} />;
    }
    
    return(
            <div
                id="story-card"
                onClick={ () => onClick() }
            >
                { image &&  renderImage() }
                <div className="card__content">
                    <h1> { title } </h1>
                    <p> { content.substr(0,200) } </p>
                    <span> { autorName } </span>
                </div>
            </div>
    );
}

export default StoryCard;