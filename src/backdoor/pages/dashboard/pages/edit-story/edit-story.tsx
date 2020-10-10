import * as React from 'react';
import {
    Link,
    useParams
} from 'react-router-dom';
import {
    db,
    storage
} from '../../../../../firebase';
import useInput from '../../../../../components/input';
import useTextarea from '../../../../../components/textarea';
import useToogle from '../../../../../components/toogle';
import ArrowLeftIcon from '../../../../../static/arrow-left.svg';
import DragAndDrop from '../../../../../components/drag-and-drop';
import { StateContext } from '../../../../context/context';
import Spinner from '../../../../../components/spinner';
import Popup from '../../../../../components/popup';
import './styles.scss';

interface StoryProps {
    id?: string
}

interface Imagen {
    url: string,
    file: File,
    fileM?: File
}

const EditStory = () => {

    const param = useParams<StoryProps>();
    let imgPrev : {
        image: string,
        imageM: string
    } = null;
    const [image, setImage] = React.useState<Imagen>(null);
    const { state } = React.useContext( StateContext );
    const [loading,toogleLoading] = React.useState<boolean>(true);
    const [ popup, tooglePopup ] = React.useState<boolean>(false);
    const [ finish, toogleFinish ] = React.useState<boolean>(false);
    const imageRef = storage.ref().child('images');


    React.useEffect(()=>{
        getStory();
    },[]);




    const getStory = () => {
        if( param.id ){
            db.collection('Story').doc(param.id).get().then(
                ( doc )=>{
                    if( doc.exists ){
                        const data = doc.data();
                        titleInput.setValue(data.title);
                        pTextarea.setValue(data.content);
                        toogle.setValue(data.isPublic);
                        if( data.image ){
                            console.log(data.image)
                            imageRef.child( data.image ).getDownloadURL().then( url => {
                                setImage({
                                    file: null,
                                    url: url
                                })
                                imgPrev = {
                                    image: data.image,
                                    imageM: data.imageM
                                };
                                toogleLoading( false );
                        });
                        }else {
                            toogleLoading( false );
                        }
                    }
                }
            )
        }else{
            toogleLoading( false );
        }
    }


    const onChangeImage = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const file = e.target.files[0];
        const reg = new RegExp(/^.*\.(jpg|jpeg|png)$/,"i");
        const match = file?.name.match(reg);
        if(file && match ){
            toogleLoading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.src = String(reader.result);
                img.onload = ( e : any ) => {
                    const  canvas = document.createElement("canvas");
                    const MAX_HEIGHT = 400;
                    const sacaleSize = MAX_HEIGHT / e.target.height;
                    canvas.height =  MAX_HEIGHT;
                    canvas.width =  sacaleSize * e.target.width;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
                    const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
                    const bytes = srcEncoded.split(',')[0].indexOf('base64') >= 0 ?
                    atob(srcEncoded.split(',')[1]) : (window).unescape(srcEncoded.split(',')[1]);  
                    const mime = srcEncoded.split(',')[0].split(':')[1].split(';')[0];
                    const max = bytes.length;
                    const ia = new Uint8Array(max);
                    for (var i = 0; i < max; i++) {
                        ia[i] = bytes.charCodeAt(i);
                    }
                    
                    const min = new File([ia],`min_${file.name}`,{type:mime});

                    setImage({
                        url: String(reader.result),
                        file,
                        fileM: min
                    });
                    toogleLoading(false);
                }
            
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

    const toogle = useToogle({
        status: false
    })

    const onSubmit = async () => {
        toogleLoading(true);
        if( param.id ){
            if( ( !image && imgPrev ) || ( image?.file && imgPrev ) ){
                imageRef.child( imgPrev.image ).delete().catch(() => console.log('error'));
                imageRef.child( imgPrev.imageM ).delete().catch(() => console.log('error'));
            }else{
                if ( image?.file ){
                    await imageRef  .child( state.id + titleInput.value + image?.file.name )
                                    .put( image?.file );
                    await imageRef  .child( state.id + titleInput.value + image?.fileM.name )
                                    .put( image?.fileM );
                }

                await db.collection('Story').doc(param.id).update({
                    title: titleInput.value,
                    content: pTextarea.value,
                    isPublic : toogle.value,
                    image: ( image?.file ) ? state.id + titleInput.value + image?.file.name : null,
                    imageM: ( image?.fileM ) ? state.id + titleInput.value + image?.fileM.name : null,
                    userId: state.id,
                    autorName: state.name
                })          
            }

        }else{
            try{
                if( image?.file ){
                    await imageRef  .child( state.id + titleInput.value + image?.file.name )
                                    .put( image?.file );
                    await imageRef  .child( state.id + titleInput.value + image?.fileM.name )
                                    .put( image?.fileM );
                }
                    await db.collection('Story').add({
                        title: titleInput.value,
                        content: pTextarea.value,
                        isPublic: toogle.value,
                        image:  ( image?.file ) ? state.id + titleInput.value + image?.file.name : null,
                        imageM:  ( image?.fileM ) ? state.id + titleInput.value + image?.fileM.name : null,
                        userId: state.id,
                        autorName: state.name,
                    })
                    titleInput.setValue('');
                    pTextarea.setValue('');
                    setImage(null);

            }catch(err){
                console.log(err)
            }
    }
    toogleLoading(false);
    tooglePopup(false);
    toogleFinish( true );
    }   

    return(
    <>
        <div id="newStory">
            { loading && <Spinner/> }
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
            tooglePopup( true );
        }}> 
                <div className="content__img" >
                    {
                        image 
                        ?   
                            <>
                            <img
                                className="img__portada" 
                                src={image.url}
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
                    <div className="content_toogle">
                        <span> Publicar </span>
                        { toogle.input }
                    </div>
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
                        { ( param.id ) ? 'Editar' : 'Crear' }
                    </button>
                </div>
            </form>
        </div>
        <Popup
            showPopup={ finish }
            tooglePopup={ () => toogleFinish( false ) }
        >
            <h2 className="popup-h2">
                    Los cambios han sido realizados con exito
            </h2>
            <div className="button_wrapper">
                <button 
                    className="button__primary"
                    onClick={ () => toogleFinish( false ) }
                    > Aceptar 
                </button>
            </div>
        </Popup>
        <Popup
            showPopup={ popup }
            tooglePopup={ () => tooglePopup( false ) }
        >
            <h2 className="popup-h2"> { 
                                            (param.id) ? 
                                            '¿ Está seguro de que desea realizar los cambios ?' : 
                                            '¿ Está seguro de crear la hisotria ?'}
            </h2>
            
            <div className="button_wrapper">
            <button 
                className="button__primary"
                onClick={ onSubmit }
                > Aceptar 
            </button>
            
            <button 
                className="button__error" 
                onClick={ () => { tooglePopup(false) } }
                > Cancelar </button>
            </div>
            
        </Popup>
    </>
    );
}

export default EditStory;