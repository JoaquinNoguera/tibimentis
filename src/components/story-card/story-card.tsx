import * as React from 'react';
import { Story } from '../../types/Story';
import Popup from '../../components/popup';
import { db, storage } from '../../firebase';
import './styles.scss';

interface storyCardProps extends Story {
    onDeleteStory : Function
}



const StoryCard = ( props : storyCardProps ) => {
    
    const [ popup, tooglePopup ] = React.useState(false);

    const onDelete = async () => {
        if(  props.image )
            await storage.ref().child(`images/${props.image}`).delete().catch(() => console.log('error'));
        await db.collection('Story').doc(props.id).delete().catch( () => console.log('error'));
        props.onDeleteStory( props.id );
    }

    return(
        <>
        <div className="storyCard">
            <div className="storyCard__header">
                <h1> {props.title} </h1>
                { !props.isPublic ? <h3> Borrador </h3> : null }
            </div>
            <p> {props.content.substr(0,200)}... </p>
            <div className="storyCard__botton">
                <button className="button__primary"> Editar </button>
                <button className="button__error" onClick={() => {tooglePopup(true)}}> Borrar </button>
            </div>
        </div>

        
        <Popup
            showPopup={ popup }
            tooglePopup={ () => tooglePopup( false ) }
        >
            <h2> ¿Está seguro que desea eliminar { props.title } ?</h2>

            <button 
                className="button__primary"
                onClick={ onDelete }
            > Aceptar 
            </button>
            
            <button 
                className="button__error" 
                onClick={ () => {tooglePopup(false)} }
            > Cancelar </button>
            
        </Popup>
        </>
    )
}

export default StoryCard;