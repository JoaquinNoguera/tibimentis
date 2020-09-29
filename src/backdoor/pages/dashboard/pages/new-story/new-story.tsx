import * as React from 'react';
import {
    Link
} from 'react-router-dom';
import {
    db,
    storage
} from '../../../../../firebase';
import useInput from '../../../../../components/input';
import useTextarea from '../../../../../components/textarea';
import ArrowLeftIcon from '../../../../../static/arrow-left.svg';
import DragAndDrop from '../../../../../components/drag-and-drop';
import { StateContext } from '../../../../context/context';
import './styles.scss';


const NewStory = () => {

    const [image, setImage] = React.useState<string>(null);
    
    const { state } = React.useContext( StateContext );
    const [loading,toogleLoading] = React.useState<boolean>(false);
    const imageRef = storage.ref().child('images');

    const onChangeImage = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const file = e.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = function() {
                setImage( String(reader.result) );
            }
            reader.readAsDataURL(file);
        } 
    }

    
    const titleInput = useInput({
        init:'',
        name: 'Nombre del titulo',
        otherProps: {
            type: 'text',
            required: true,
            placeholder: 'Nombre del titulo',
        }
    });

    const pTextarea = useTextarea({
        init:'',
        name: 'Contenido de la hisotria',
        otherProps: {
            type: 'text',
            required: true,
            placeholder: 'Contenido de la hisotria',
        }
    });

    const onSubmit = async () => {
        toogleLoading(true);
        try{
            if( image ){
                const snapshotImage = await imageRef.child( image.substr(100,120) )
                                                    .putString(image);
                await db.collection('Story').add({
                   title: titleInput.value,
                   content: pTextarea.value,
                   isPublic : false,
                   image: snapshotImage.metadata.fullPath,
                   userId: state.id,
                   autorName: state.name,
               })
            }else{
                await db.collection('Story').add({
                    title: titleInput.value,
                    content: pTextarea.value,
                    isPublic: false,
                    userId: state.id,
                    autorName: state.name,
                })
            }
            toogleLoading(false);
        }catch(err){
            console.log(err)
        }
        

    }   

    if(loading) return <div> Loading ... </div>
    
    else
    return(
        <div id="newStory">
            <div className="newStory__header">
                <div className="hedaer__left">
                    <h1>Nueva Historia</h1>
                </div>
                <div className="hedaer__right">
                    <Link
                        to="/backdoor/"
                    >
                        <button
                            className="button__primary"
                        >
                            <img src={ArrowLeftIcon} />
                        </button>
                    </Link>
                </div>
            </div>
            <form className="newhisotry__content" onSubmit={    ( e : React.FormEvent<HTMLFormElement>  ) => { 
            e.preventDefault();
            onSubmit();
        }}> 
                <div className="content__img" >
                    {
                        image 
                        ?   
                            <>
                            <img
                                className="img__portada" 
                                src={image}
                            />
                            <button 
                                className="button__primary"
                                onClick={()=>{ setImage(null) }}
                                type="button"
                            > Borrar 
                            </button>
                            </> 
                        :   
                            <>
                            <div
                                className="img_dragAndDropWrapper"
                            >
                                <DragAndDrop
                                    text="Arrastra la imágen aquí..."
                                    saveFile={setImage}
                                    
                                />
                            </div>
                            <input 
                                id="img__input_file"
                                name="img__input_file"
                                onChange={onChangeImage}
                                type='file'
                                accept=".jpg,.png,.jpeg"
                            />
                            <label  
                                htmlFor="img__input_file"
                                className="button__primary"
                            >
                                Buscar Imagen
                            </label>
                            </> 
                    }
                </div>

                <div 
                    className="content__text"
                >
                    { titleInput.input }
                    { pTextarea.textarea }
                </div>

                <div
                    className="content__option"
                >
                    <button
                        className="button__primary"
                        type="submit"
                    >
                        Crear
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewStory;