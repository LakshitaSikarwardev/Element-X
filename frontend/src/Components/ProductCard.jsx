import './../Css/ProductCard.css';
import { FaRegUserCircle } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { FaCode } from "react-icons/fa6";
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcLikePlaceholder } from "react-icons/fc";
import Data from './Data';
import { AuthContext } from '../Autherization';

const ProductCard = ({html="",css="",id="",show=false,username="",likedPeople=[],background = "#333",height="45vh"})=>{
    
    const [getCode,setGetCode] = useState(false);
    const [isLiked,setIsLiked] = useState(false);
    const [likes,setLikes] =  useState(likedPeople.length || 0);
    const {username : user,token} = useContext(AuthContext);

    const navigateTo = useNavigate();
    const handleMouseEnter = () => setGetCode(true);
    const handleMouseLeave = () => setGetCode(false);

    const handleNavigation = ()=>{
        navigateTo(`/getcode/${id}`);
    }

    useEffect(()=>{
        if(likedPeople && Array.isArray(likedPeople))
        setIsLiked(likedPeople.includes(user));
    },[likedPeople,user]);

    const toggleLiked = async () => {
        if (user == null) {
            navigateTo('/login', { state: { text: "Login" } });
            return;
        }
    
        try {
            const response = await fetch(`https://elementx-7ure.onrender.com/like/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization" : token
                },
                body: JSON.stringify({ username: user })
            });
    
            if (response.ok) {
                const data = await response.json();
                setLikes(data.likes);  
                setIsLiked(!isLiked); 
            } else {
                console.error("Error updating like");
            }
        } catch (error) {
            console.error("Request failed", error);
        }
    };
    

    return(
        <>
        <div className="product-card" style={{height : show ? height : "45vh"}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="card-content" style={{backgroundColor : background}}>
                <Data html={html} css={css}/>
                {
                getCode ? 
                        <button onClick={handleNavigation} className='get-code-button'><FaCode style={{ fontSize: "large" }} />{user === username ? <div>Update or Delete</div> : "Get Code"}</button>
                        : null
                }
            </div>
            
            {
                show && <div className="card-detail">
                <div onClick={()=>navigateTo("/profile/"+username)} className='card-bottum'><FaRegUserCircle style={{fontSize:"large"}}/>{username}</div>
                <div onClick={toggleLiked} className='card-bottum'>{isLiked ? <FcLike style={{ fontSize: "x-large",cursor : "pointer" }} /> : <FcLikePlaceholder style={{ fontSize: "x-large",cursor : "pointer" }}/>}{likes}</div>
                </div>
            }
            
        </div>
        
        </>
    )
}

export default ProductCard;