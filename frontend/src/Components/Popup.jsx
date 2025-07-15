import React, { useState,useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { CiCircleInfo } from "react-icons/ci";
import Data from './Data';
import './../Css/Popup.css';
import { AuthContext} from './../Autherization';
import Loader from './Loader';


const Popup = ({ html, css, background,setPopup,category}) => {
    const navigateTo = useNavigate();
    const [selectedChoice, setSelectedChoice] = useState("original");
    const [loading,setLoading] = useState(false);
    const [creatorName,setCreatorName] = useState("");
    const [creationLink,setCreationLink] = useState("");
    const {username,token} = useContext(AuthContext);
    const [done,setDone] = useState(false);

    const handleChange = (event) => {
        setSelectedChoice(event.target.value);
    };

    const handleCreate = async ()=>{ 
        try{
            setLoading(true);
            if(username == null || token == null) {
                logout();
                navigateTo("/login",{state : {text : "Login"}});
            } 

            const response = await fetch("https://elementx-7ure.onrender.com/reviewPost",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : token
                },
                body : JSON.stringify({
                    html : html,
                    css : css,
                    username : username,
                    category : category,
                    background : background,
                    tailwind : "tailwind",
                    creator : selectedChoice,
                    creationLink : creationLink,
                    creatorName : creatorName
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message);
                return;
              }
              setDone(true);
              setMessage("Your creation has been successfully sent for review.");
              setDescription("Our team will evaluate it, and we will inform you within 24 hours regarding the next steps. Thank you for your patience!");
              setLoading(false);
              setPopup(false);
        }catch(e)
        {
            setLoading(false);
            console.log("Inter server error");
        }
    }

    const handleOk = () => {
        navigateTo("/");
        window.scrollTo(0, 0);
    }

    return (
        <div className="popup-container">
            <div className="popup">
                <div className="popup-preview">
                    <div className="popup-info">
                        <div className="popup-info-content">
                            <CiCircleInfo style={{ fontSize: "3vh" }} />
                            Make sure your post looks good on the preview card as well
                        </div>
                    </div>
                    <div className="popup-output-container">
                        <div className="popup-output" style={{ backgroundColor: background }}>
                            <Data html={html} css={css} />
                        </div>
                    </div>
                </div>
                <div className="popup-user-info">
                    {
                        done ? 
                        <div class="done-popup">
                        <div className='done-popup-heading'>Well Done!</div>
                        <div className='done-popup-message'>Your creation has been successfully sent for review.</div>
                        <div className='done-pop-description'>Our team will evaluate it, and we will inform you within 24 hours regarding the next steps. Thank you for your patience!</div>
                        <button onClick={handleOk}>OK</button>
                        </div>
                        : 
                        <div>
                    <div className="popup-heading">
                        Are you the original creator of this element?
                    </div>
                    <div className="popup-input-container">
                        <div className="popup-input">
                            <input 
                                type="radio" 
                                id="choice1" 
                                name="choice" 
                                value="original"
                                checked={selectedChoice === "original"}
                                onChange={handleChange}
                            />
                            <label htmlFor="choice1" className="popup-input-heading">
                                Yes, I am the original creator
                            </label>
                        </div>
                        <div className="popup-input">
                            <input 
                                type="radio" 
                                id="choice2" 
                                name="choice" 
                                value="share"
                                checked={selectedChoice === "share"}
                                onChange={handleChange}
                            />
                            <label htmlFor="choice2" className="popup-input-heading">
                                No, I found this post somewhere else and I want to share it with the community here
                            </label>
                            {
                                selectedChoice === "share" && 
                                <div className="popup-original-userinfo">
                                <div className="original-userinfo">
                                    <div >Link to the source (valid URL)</div>
                                    <input type="text" placeholder="https://example.com"
                                        value={creationLink}
                                        onChange={(e)=>setCreationLink((e.target.value))}
                                    />
                                </div>
                                <div className="original-userinfo">
                                    <div>Name of the creator or the source</div>
                                    <input type="text" placeholder="John Doe"
                                        value={creatorName}
                                        onChange={(e)=>setCreatorName(e.target.value)}
                                    />
                                </div>
                                </div>
                            }
                            
                        </div>
                        <div className="popup-input">
                            <input 
                                type="radio" 
                                id="choice3" 
                                name="choice" 
                                value="modified"
                                checked={selectedChoice === "modified"}
                                onChange={handleChange}
                            />
                            <label htmlFor="choice3" className="popup-input-heading">
                                No, I found this post somewhere else and I made significant changes to it
                            </label>
                            {
                                selectedChoice === "modified" && 
                                <div className="popup-original-userinfo">
                                <div className="original-userinfo">
                                    <div >Link to the source (valid URL)</div>
                                    <input type="text" placeholder="https://example.com"/>
                                </div>
                                <div className="original-userinfo">
                                    <div>Name of the creator or the source</div>
                                    <input type="text" placeholder="John Doe"/>
                                </div>
                                </div>
                            }
                        </div>
                        <div className="popup-buttons">
                            <button onClick={()=>setPopup(false)}>Cancel</button>
                            <button onClick={handleCreate}>{loading ? <Loader /> : "Submit for review"}</button>    
                        </div>
                    </div>
                    </div>
                    }
                    
                </div>
                
            </div>
        </div>
    );
};

export default Popup;
