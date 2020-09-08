import * as React from 'react';


type DashboardProps = {
    id : string
}


const Dashboard : React.FunctionComponent<DashboardProps>= ( { 
        id 
}   : DashboardProps  ) => {
    
    
    console.log( id );
    
    return (
        <div>
            Holaaaaa
        </div>
    )
}

export default Dashboard;
