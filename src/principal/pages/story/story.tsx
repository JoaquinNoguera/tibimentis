import * as React from 'react';
import { Story } from '../../../models/Story';
import { db, storage } from '../../../firebase'; 
import { useParams } from 'react-router-dom';
import Spinner from '../../../components/spinner';
import NotFound from '../../../components/404';
import './styles.scss';

const Story = () => {

    const [ notExist, toogleNotExist ] = React.useState<boolean>( null ); 
    const [ loading, toggleLoading ] = React.useState<boolean>( true );
    const [ url, setUrl ] = React.useState<string>('');
    const [ story, setStory ] = React.useState<Story>( null );

    const params = useParams<{
        id?: string
    }>();


    const getStory = async () => {
        if( params?.id ){
            const consult = await db.collection('Story').doc(params.id).get();
            if( consult.exists ){
                const data : Story = {
                    isPublic: consult.data().isPublic,
                    userId: consult.data().userId,
                    autorName: consult.data().autorName,
                    content: consult.data().content,
                    title: consult.data().title,
                    image: ( consult.data().image ) ? consult.data().image : null,
                    id: consult.data().id
                }
                setStory( data );
                if( data.image )
                    storage.ref().child('images').child( data.image ).getDownloadURL().then( url => {
                        setUrl(url);
                    });
            }else{
                toogleNotExist( true )    
            }
        }else
            toogleNotExist( true )
        
        toggleLoading( false );
    }


    React.useEffect( () => {
        getStory();
    }, []);

    const renderImage = () => {
        
        if( story?.image ){
            return  <div className="card__image">
                        <div className="image" style={{ backgroundImage: `url(${url})`}} />
                    </div>

        }else   
            return;
    }

    if( notExist )
        return <NotFound/>    
    else
        return (
            <div
                id="story"
            >
                { loading && <Spinner/>}
                <h1> { story?.title }</h1>
                <div>
                    { renderImage() }
                    <p>  { story?.content }</p>    
                    <p className="autor"> { story?.autorName } </p>   
                </div>
            </div>

        );
}

export default Story;