import './../Css/Review.css';
import { AuthContext } from '../Autherization';
import React, { useContext, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import Data from './Data'
import { EditorView } from "@codemirror/view";


const Review = ()=>{
    const {token} = useContext(AuthContext);
    const [data,setData] = useState();
    const [activeTab, setActiveTab] = useState("html");
    
        const transparentTheme = EditorView.theme({
            "&": { backgroundColor: "transparent !important", border: "none !important" },
            ".cm-scroller": { backgroundColor: "transparent !important" },
            ".cm-content": { backgroundColor: "transparent !important",padding : "2vh"},
            ".cm-gutters": { backgroundColor: "transparent !important", borderRight: "none !important" },
            ".cm-activeLine": { backgroundColor: "transparent !important" },
            ".cm-activeLineGutter": { backgroundColor: "transparent !important" },
            ".cm-lineNumbers" : { color : "white !important" },
            ".cm-content::after" : { display : "none" }
            }, { dark: true });
   
            const fetchData = async ()=>{
                const response = await fetch("https://elementx-7ure.onrender.com/getReviewElements",{
                    method : "GET",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : token
                    }
                });
                if(response.ok)
                {
                    const data = await response.json();
                    setData(data);
                }
            }

    useEffect(()=>{
        try{  
            fetchData();
        }catch(e)
        {
            console.log(e);
        }
    },[token]);

    const handleAccept = async (element)=>{
        const response = await fetch("https://elementx-7ure.onrender.com/createElement",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : token
            },
            body : JSON.stringify({element})
        })
        if(response.ok)
        {
            alert("Element added");
            fetchData();
        }
        else alert("error");
    }

    const handleReject = async (username,id)=>{
        const response = await fetch("https://elementx-7ure.onrender.com/rejectPost",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : token
            },
            body : JSON.stringify({username,id})
        })
        if(response.ok)
        {
            alert("Element rejected");
            fetchData();
        }
        else alert("error");
    }

    return(
        <div className='review'>
            {
                data?.map((element)=>(
                    <>
                    <div className='review-container'>
                <div className='review-output-conatiner'>
                        <Data html={element.html} css={element.css}/>
                </div>
                <div className="review-code-input">
                    <div className="review-code-navbar">
                        <button
                            onClick={() => setActiveTab("html")}
                            className={
                                activeTab === "html"
                                    ? "review-code-active-button"
                                    : "review-code-inactive-button"
                            }
                        >
                        
                            <img style={{ height: "20px" }} src="./html.png"/>HTML
                        </button>
                        <button
                            onClick={() => setActiveTab("css")}
                            className={
                                activeTab === "css"
                                    ? "review-code-active-button"
                                    : "review-code-inactive-button"
                            }
                        >
                            <img style={{ height: "25px" }} src="./css.png" />CSS
                        </button>
                    </div>
                    <div className="review-code-input-body">
                        {activeTab === "html" && (
                            <CodeMirror className="textarea"
                                value={element.html}
                                extensions={[html(),transparentTheme,EditorView.lineWrapping]}
                                theme={oneDark}
                            />
                        )}
                        {activeTab === "css" && (
                            <CodeMirror className="textarea"
                                value={element.css}
                                extensions={[css(),transparentTheme,EditorView.lineWrapping]}
                                theme={oneDark}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className='review-code-buttons'>
            <button onClick={()=>handleReject(element.username,element._id)}>Reject</button>
            <div style={{color : "white",fontSize : "x-large"}}>{element.category}</div>
            <button onClick={()=>handleAccept(element)} >Accept</button>
            </div>
            </>
                ))
            }
            
        </div>
    )
}

export default Review;