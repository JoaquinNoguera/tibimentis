import * as React from 'react';
import PlusIcon from '../../../../../static/plus.svg';
import {
    Link
} from 'react-router-dom';
import { db } from '../../../../../firebase';
import { Stories } from '../../../../../models/Story';
import { StateContext } from '../../../../context/context';
import {useSpring, animated} from 'react-spring';
import StoryCard from '../../components/story-card';
import useInputSearch from '../../../../../components/inputSearch';
import Spinner from '../../../../../components/spinner';
import Pagination from '../../../../../components/pagination';

import './styles.scss';

const ControlPanel = () => {

    const [ stories, setStories ] = React.useState<Stories>( null );
    const [ visibleStories, setVisibleStories ] = React.useState<Stories>(null);
    const [ publicStories, tooglePublicStories ] = React.useState<boolean>( true );
    const [ privateStories, tooglePrivateStories ] = React.useState<boolean>( true );
    const [ loading, toogleLoading ] = React.useState<boolean>( false );
    const isMountedRef = React.useRef(null);

    const publicProps = useSpring({
        fill: publicStories ? '#ffffff' : '#07689F',
        backgroundColor: publicStories ? '#07689F' : '#ffffff',
    });

    const privateProps = useSpring({
        fill: privateStories ? '#ffffff' : '#07689F',
        backgroundColor: privateStories ? '#07689F' : '#ffffff',
    });
    const { state } = React.useContext( StateContext );
    
    const getStories = async () : Promise<void> => {
        toogleLoading(true);
        const consult = await db    .collection('Story')
                                    .where("userId", "==", state.id)
                                    .get();
        let stories : Stories = [];
        
        consult.forEach( c => {
            const story = c.data();
            stories.push( {
                id: c.id,
                autorName: story.autorName,
                content: story.content,
                isPublic: story.isPublic,
                title: story.title,
                userId: story.userId,
                image: ( story.image ) ? story.image : null 
            } )
        });
        if( stories && isMountedRef.current ){
            setStories(stories);
            setVisibleStories(stories);
        }
        toogleLoading(false);
    }

    const onDeleteStory = ( id : string ) : void => {
        const i = stories.findIndex( s => s.id === id);
        let newStories = stories;
        newStories.splice(i,1); 
        getStories();
    }

    const filterStories = () => {
        const re = new RegExp(`(${searchInput.value.toUpperCase()})`);
        if( stories ){
            setVisibleStories(
                stories.filter( s => {
                   if( ( searchInput.value === "" ||  s.title.toUpperCase().search( re ) !== -1 ) )  
                        return s;
                    else
                        return null;
                })
            )
        }
    }


    React.useEffect(()=>{
        isMountedRef.current = true;
        getStories();
        return () => isMountedRef.current = false;
    },[ ])
    

    React.useEffect(()=>{
        if( stories ){
            setVisibleStories(
                stories.filter( s => {
                   if( ( s.isPublic && publicStories ) || ( !s.isPublic && privateStories ) )  
                        return s;
                    else
                        return null;
                })
            )
        }
        
    },[ publicStories, privateStories ]);

    const searchInput = useInputSearch({
        onClick: filterStories
    });

    const listCard : JSX.Element[]= ( visibleStories ) ?
                        visibleStories.map( s =>  <StoryCard key={s.id} { ...s }  onDeleteStory={ onDeleteStory }/> ) : [];
    
    console.log(listCard);

    return(
        <div id="controlPanel">
            { loading && <Spinner/> }
            <div className="controlPanel__header">
                <div className="hedaer__left">
                    <h1>Panel de Administración</h1>
                </div>
                <div className="hedaer__right">
                    <div className="right__filterButtons">
                        <animated.button
                            className="rombo"
                            style={ publicProps }
                            title="Mostrar historias publicadas"
                            onClick={ () => tooglePublicStories( !publicStories ) }
                        >
                            <div
                                title="Mostrar historias publicadas"
                            >
                                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="book-open" className="svg-inline--fa fa-book-open fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z"></path></svg>
                            </div>
                        </animated.button>
                        <animated.button
                            className="rombo"
                            style={ privateProps }
                            title="Mostrar historias borrador"
                            onClick={ () => tooglePrivateStories( !privateStories ) }
                        >
                            <div
                                title="Mostrar historias borrador"
                            >
                            <svg  aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen-nib" className="svg-inline--fa fa-pen-nib fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M136.6 138.79a64.003 64.003 0 0 0-43.31 41.35L0 460l14.69 14.69L164.8 324.58c-2.99-6.26-4.8-13.18-4.8-20.58 0-26.51 21.49-48 48-48s48 21.49 48 48-21.49 48-48 48c-7.4 0-14.32-1.81-20.58-4.8L37.31 497.31 52 512l279.86-93.29a64.003 64.003 0 0 0 41.35-43.31L416 224 288 96l-151.4 42.79zm361.34-64.62l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.75 18.75-49.15 0-67.91z"></path></svg>
                            </div>
                        </animated.button>
                    </div>
                    
                    { searchInput.input }
               
                </div>
            </div>
            <div className="controlPanel__panel">
                <div
                    className="panel__title"
                >
                    <h1> Mis Hisotrias</h1>
                    <Link
                        to="/backdoor/new"
                    >
                        <button
                            className="button__primary"
                            > 
                            Nueva historia 

                            <img src={PlusIcon}/>
                        </button>
                    </Link>
                </div>
                <div className="panel__cards">
         
                    <Pagination
                        elements={listCard}
                        cant={4}
                    />
                    
                </div>
            </div>
        </div>
    );
}

export default ControlPanel;