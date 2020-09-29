import * as React from 'react';
import './styles.scss';

type PropsPagination = {
    elements: JSX.Element[],
    cant: number
}



const Pagination = ( { elements, cant } : PropsPagination ) => {
    
    if( !elements.length ) return null;

    const [ index, setIndex ] = React.useState<number>(0);
    const [ pages, setPages ] = React.useState<JSX.Element[]>([]);

    const getPagesNumbers = () : number[] => {
        if( cant * 3 >= elements.length ){
            const limit = Math.trunc(elements.length/cant) + ( elements.length % cant ? 1 : 0 );
            if (limit === 1) 
                return [];
            
                else if( limit === 2 ) 
                return [1,2];
            
                else 
                return [ 1, 2, 3];
        }
        else if ( (index + 1) * cant >= elements.length ) 
            return [ index - 1, index , index + 1];
        else if ( index === 0)
            return [ 1, 2, 3];
        else
            return [ index, index + 1, index + 2];
    }

    const renderPages = () => {
        const pages = getPagesNumbers();
        setPages( pages.map(
                    p =>    <button 
                            key={p}
                            disabled={p === (index + 1)}
                            className={ p === (index + 1) ? 'actual' : 'button__primary' }
                            onClick={()=> setIndex( p - 1)}
                        >
                            {p}
                        </button>
        ))
    }

    React.useEffect(()=>{
        window.scrollTo({top: 0, behavior: 'smooth'});
    },[index]);

    React.useEffect(()=>{
        renderPages();
    },[index, elements ]);

    return (
        <div className="pagination">
            <div className="pagination__button">
                { ( pages && pages?.length ) 
                    ? 
                    <>
                            <button 
                            className="button__primary"
                            onClick={()=>{
                                if(index){
                                    setIndex(index - 1)
                                }
                            }}
                            >
                                Anterior
                            </button>
                        { pages }
                        <button 
                            className="button__primary"
                            onClick={ () => {
                                if( !((index + 1) * cant >= elements.length) ){
                                    setIndex( index + 1 )
                                }
                            }}
                        > 
                            Siguiente
                        </button>
                    </> 
                    : null }
            </div>
            { elements.slice(index * cant, cant * (index + 1)) }
            <div className="pagination__button">
                { ( pages && pages?.length )  
                    ? 
                    (<>
                            <button 
                            className="button__primary"
                            onClick={()=>{
                                if(index){
                                    setIndex(index - 1)
                                }
                            }}
                            >
                                Anterior
                            </button>
                        { pages }
                        <button 
                            className="button__primary"
                            onClick={ () => {
                                if( !((index + 1) * cant >= elements.length) ){
                                    setIndex( index + 1 )
                                }
                            }}
                        > 
                            Siguiente
                        </button>
                    </>)
                    : null }
            </div>
        </div>
    );
}

export default Pagination;