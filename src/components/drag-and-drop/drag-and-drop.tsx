import * as React from 'react';
import IconFile from '../../static/file.svg';
import './styles.scss';

type DragAndDropProps = {
    text : string,
    saveFile: Function
}

 const DragAndDrop = ( { text, saveFile } : DragAndDropProps ) => {


    const [ active, setActive ] = React.useState<boolean>(false);


    const onHandlerOndrop = ( e : React.DragEvent<HTMLDivElement> ) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        const reg = new RegExp(/^.*\.(jpg|jpeg|png)$/,"i");
        const match = file?.name.match(reg);
        if(match){
        const reader = new FileReader();
        reader.onloadend = function() {
             saveFile( {
                url: String( reader.result ),
                file
             } );
        }
        reader.readAsDataURL(file);
    }
        setActive( false );

    }

        return(
                    <div 
                        id= 'wrapper-dragAndDrop'
                        
                        className={ (active) ? 'active' : ''}
                    >
                        <div 
                            id="dragAndDrop__layaout"
                            
                            onDragEnter= { () => setActive( true ) }
                            onDragLeave= { () => setActive( false ) }
                            onDrop={ onHandlerOndrop }
                            onDragOver= { ( e : React.DragEvent<HTMLDivElement> ) =>{
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                        />
                            <img src={IconFile} />
                        <p> {text} </p>
                    </div>
        );
}

export default DragAndDrop;