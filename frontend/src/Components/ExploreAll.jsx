import {useNavigate} from 'react-router-dom';

const ExploreAll = ()=>{
    const navigate = useNavigate();

    return(
        <>
            <div style={{width : "100%"}} className='Explore-all'>
                <button onClick={()=>navigate('/elements')} className='Explore-all-button'>Explore All Elemnets</button>
            </div>
        </>
    )
}

export default ExploreAll;