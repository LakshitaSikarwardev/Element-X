import './../Css/BigProductCard.css';
import { FaRegUserCircle } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { FaCode } from "react-icons/fa6";
import Data from './Data';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcLikePlaceholder } from "react-icons/fc";
import { AuthContext } from '../Autherization';

const BigProductCard = ({ html = "", css = "", id = "", show = false, username = "", likedPeople = [], background = "#333" }) => {

    const [getCode, setGetCode] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(likedPeople.length || 0);
    const { username: user, token } = useContext(AuthContext);
    const navigateTo = useNavigate();
    const handleMouseEnter = () => setGetCode(true);
    const handleMouseLeave = () => setGetCode(false);


    useEffect(() => {
        if (likedPeople && Array.isArray(likedPeople))
            setIsLiked(likedPeople.includes(user));
    }, [likedPeople, user]);

    const toggleLiked = async () => {
        if (user == null) {
            navigateTo('/login', { state: { text: "Login" } });
            return;
        }

        try {
            const response = await fetch(`https://elementx-7ure.onrender.com/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": token
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

    return (
        <>
            <div className="big-product-card"  style={{height : show ? "100vh" : "110vh"}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="big-card-content" style={{ backgroundColor: background }}>
                    <Data html={html} css={css} />
                </div>
                {
                    getCode ?
                        <button 
                        onClick={()=>navigateTo(`/getcode/${id}`)}
                        style={{ bottom : show ? "6em" : "1em"}}
                        className='big-card-get-code-button'><FaCode style={{ fontSize: "large" }} />{user === username ? "Update or Delete" : "Get Code"}</button>
                        : null
                }
                {
                    show && <div className="big-card-detail">
                        <div onClick={()=>navigateTo("/profile/"+username)} className='big-card-bottum'><FaRegUserCircle style={{ fontSize: "large" }} />{username}</div>
                        <div onClick={toggleLiked} className='big-card-bottum'>{isLiked ? <FcLike style={{ fontSize: "x-large", cursor: "pointer" }} /> : <FcLikePlaceholder style={{ fontSize: "x-large", cursor: "pointer" }} />}{likes}</div>

                    </div>
                }
            </div>
        </>
    )
}

export default BigProductCard;