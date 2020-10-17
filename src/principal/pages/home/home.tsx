import * as React from 'react';
import StoryCard from '../../components/story-card';
import { db } from '../../../firebase';
import { Stories } from '../../../models/Story';
import './styles.scss';

const Home = () => {

    const [ stories, setStories ] = React.useState<Stories>([]);
    const [ lastDate, setLastDate ] = React.useState<Date>( new Date());
    const [ finish, toogleFinish ] = React.useState<boolean>(false);
    const [ loading, toogleLoading ] = React.useState<boolean>(false);
    const observer = React.useRef( null );
    const lastPostElementRef = React.useCallback( node => {
        if( loading ) return;
        else{
            if( observer?.current ) observer.current.disconnect();
            observer.current = new IntersectionObserver( entry => {
                if( entry[0].isIntersecting  && !finish ){
                    getStories();
                }
            })
            if( node ) observer.current.observe(node);
        }
    }, [ loading, finish ]);


    const getStories = async () => {
        if( !finish ){
            toogleLoading(true);
            const consult = await db    .collection('Story')
                                        .where("isPublic", "==", true)
                                        .where("createDate","<", lastDate)
                                        .orderBy("createDate","desc")
                                        .limit(5)
                                        .get();

           
            let newStories : Stories = [ ...stories];
            let date : Date = null;
            if( consult.docs.length === 0 ){
                toogleFinish( true );
            }else{
                consult.forEach( c => {
                    const story = c.data();
                    date = story.createDate;
                    newStories.push( {
                        id: c.id,
                        autorName: story.autorName,
                        content: story.content,
                        isPublic: story.isPublic,
                        title: story.title,
                        userId: story.userId,                    
                        image: ( story.image ) ? story.image : null 
                    } );
                });
                setLastDate(date);
                setStories(newStories);
            }   
            toogleLoading( false );
        }
    }              

    React.useEffect(()=>{
        getStories();
    },[])

    console.log(stories);

    const listStories = stories.map( ( s, index ) =>  {
            if( stories.length === (index + 1) )
                return <div ref={lastPostElementRef} key={s.id}>
                            <StoryCard  {...s} />
                        </div>
                else 
                return <StoryCard key={s.id} {...s} /> 
            })
    return (
        <div
            id="home"
        >
            <div className="home__logo">
                <h1>Tibimentis</h1>
            </div>
            <div className="home__cardsWrapper">
                <div className="home__cardsContainer">
                    { listStories }
                </div>
            </div>
        </div>
    )
}


export default Home;

