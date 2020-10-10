import * as React from 'react';
import { Story } from '../../../../../models/Story';
import Popup from '../../../../../components/popup';
import { db, storage } from '../../../../../firebase';
import { useHistory } from 'react-router-dom';
import Spinner from '../../../../../components/spinner';
import './styles.scss';

interface storyCardProps extends Story {
    onDeleteStory : Function
}



const StoryCard = ( props : storyCardProps ) => {
    
    const [ popup, tooglePopup ] = React.useState<boolean>(false);
    const [ loading, toogleLoading ] = React.useState<boolean>(false);
    const history = useHistory();

    const onDelete = async () => {
        toogleLoading(true);
        if(  props.image )
            await storage.ref().child(`images/${props.image}`).delete().catch(() => console.log('error'));
        await db.collection('Story').doc(props.id).delete().catch( () => console.log('error'));
        props.onDeleteStory( props.id );
        tooglePopup(false);
        toogleLoading(false);
    
    }

    return(
        <>
        { loading && <Spinner/>}
        <div className="storyCard">
            <div className="storyCard__header">
                <h1> {props.title} </h1>
                { !props.isPublic ? <h3> Borrador </h3> : null }
            </div>
            <p> {props.content.substr(0,200)}... </p>
            <div className="storyCard__botton">
                <button 
                    className="button__primary"
                    onClick={()=>{ history.push(`/backdoor/story/${props.id}`)}}
                > Editar </button>
                <button 
                    className="button__error" 
                    onClick={() => {tooglePopup(true)}}
                > Borrar </button>
            </div>
        </div>

        
        <Popup
            showPopup={ popup }
            tooglePopup={ () => tooglePopup( false ) }
        >
            <h2 className="popup-h2"> ¿Está seguro que desea eliminar { props.title } ?</h2>
            
            <div className="button_wrapper">
            <button 
                className="button__primary"
                onClick={ onDelete }
                > Aceptar 
            </button>
            
            <button 
                className="button__error" 
                onClick={ () => {tooglePopup(false)} }
                > Cancelar </button>
            </div>
            
        </Popup>
        </>
    )
}

export default StoryCard;