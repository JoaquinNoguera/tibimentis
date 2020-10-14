import * as React from 'react';
import StoryCard from '../../components/story-card';
import { db } from '../../../firebase';
import { Stories } from '../../../models/Story';
import './styles.scss';

const Home = () => {

    const [ stories, setStories ] = React.useState<Stories>([]);
    const [ lastDate, setLastDate ] = React.useState<Date>( new Date());
    const [ finish, toogleFinish ] = React.useState<boolean>(false);
    const getStories = async () => {
        if( !finish ){
            const consult = await db    .collection('Story')
                                        .where("isPublic", "==", true)
                                        .where("createDate","<", lastDate)
                                        .orderBy("createDate","desc")
                                        .limit(5)
                                        .get();

            let stories : Stories = [];
            let date : Date = null;
            if( consult.docs.length === 0 ){
                toogleFinish( true );
            }else{
                consult.forEach( c => {
                    const story = c.data();
                    date = story.createDate;
                    stories.push( {
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
                setStories(stories);
            }   
        }
    }              

    React.useEffect(()=>{
        getStories();
    },[])

    console.log(stories);

    return (
        <div
            id="home"
        >
            <div className="home__logo">
                <h1>Tibimentis</h1>
            </div>
            <div className="home__cardsWrapper">
                { stories.map   ( s =>  <StoryCard key={s.id} {...s} /> ) }
            </div>
        </div>
    )
}


export default Home;

