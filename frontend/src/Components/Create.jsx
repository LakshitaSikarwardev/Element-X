import React, { useContext, useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import {dracula} from "@uiw/codemirror-theme-dracula";
import Data from './Data'
import { EditorView } from "@codemirror/view";
import "./../Css/Create.css";
import {AuthContext} from './../Autherization';
import Loader from './Loader';
import Popup from "./Popup";
import ReactDOM from "react-dom";
import { IoCopyOutline } from "react-icons/io5";
import { FcCheckmark } from "react-icons/fc";

const Create = () => {
    const [htmlCode, setHtmlCode] = useState("");
    const [cssCode, setCssCode] = useState("");
    const [activeTab, setActiveTab] = useState("html");
    const navigateTo = useNavigate();
    const location = useLocation();
    const {create} = location.state || {};
    const [loading,setLoading] = useState(false);
    const [loadingForDraft,setLoadingForDraft] = useState(false);
    const {username,token,logout,login} = useContext(AuthContext);
    const [popup,setPopup] = useState(false); 
    const [on,setOn] = useState(true);
    const [color,setColor] = useState("#e8e8e8");
    const [isCopied, setIsCopied] = useState(false);

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

    useEffect(() => {
        switch (create) {
            case "button":
                setHtmlCode(`<button class="simple-button">\nClick Me\n</button>`);
                setCssCode(`.simple-button {\nbackground-color: lightblue;\nborder: none;\npadding: 10px 20px;\nfont-size: 16px;\nborder-radius: 5px;\ncursor: pointer;\ntransition: background-color 0.3s;\n}\n.simple-button:hover {\nbackground-color: deepskyblue;\n}`);
                break;
        
            case "form":
                setHtmlCode(`<form class="simple-form">\n<label for="name">Name:</label>\n<input type="text" placeholder="Enter your name">\n<button type="submit">Submit</button>\n</form>`);
                setCssCode(`.simple-form {\ndisplay: flex;\nflex-direction: column;\nwidth: 300px;\nmargin: 20px auto;\npadding: 20px;\nborder: 1px solid lightgray;\nborder-radius: 5px;\nbackground-color: #f9f9f9;\n}\n.simple-form input {\npadding: 10px;\nmargin: 10px 0;\nborder: 1px solid #ddd;\nborder-radius: 5px;\n}\n.simple-form button {\nbackground-color: lightblue;\nborder: none;\npadding: 10px 20px;\nfont-size: 16px;\nborder-radius: 5px;\ncursor: pointer;\ntransition: background-color 0.3s;\n}\n.simple-form button:hover {\nbackground-color: deepskyblue;\n}`);
                break;
                
            case "card": 
                setHtmlCode(`<div class="simple-card">\n<h3 class="card-title">Card Title</h3>\n<p class="card-description">This is a simple card description to showcase card content.</p>\n<button class="card-button" onclick="alert('Button Clicked!')">Learn More</button>\n</div>`); 
                setCssCode(`.simple-card {\nborder: 1px solid #ddd;\nborder-radius: 10px;\npadding: 20px;\nwidth: 250px;\ntext-align: center;\nbackground-color: #f9f9f9;\nbox-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n}\n.card-image {\nwidth: 100%;\nborder-radius: 10px;\nmargin-bottom: 15px;\n}\n.card-title {\nfont-size: 18px;\nfont-weight: bold;\nmargin: 10px 0;\n}\n.card-description {\nfont-size: 14px;\ncolor: #555;\nmargin-bottom: 15px;\n}\n.card-button {\nbackground-color: lightblue;\nborder: none;\npadding: 10px 15px;\nfont-size: 14px;\nborder-radius: 5px;\ncursor: pointer;\ntransition: background-color 0.3s;\n}\n.card-button:hover {\nbackground-color: deepskyblue;\n}`); 
                break;
            
            case "switch" :
                setHtmlCode(`<div class="toggle-switch">\n<input class="toggle-input" id="toggle" type="checkbox">\n<label class="toggle-label" for="toggle"></label>\n</div>`); 
                setCssCode(`.toggle-switch {position: relative;\ndisplay: inline-block;\nwidth: 40px;\nheight: 24px;\nmargin: 10px;}\n.toggle-switch .toggle-input {display: none;}\n.toggle-switch .toggle-label {position: absolute;\ntop: 0;\nleft: 0;\nwidth: 40px;\nheight: 24px;\nbackground-color: #2196F3;\nborder-radius: 34px;\ncursor: pointer;\ntransition: background-color 0.3s;}\n.toggle-switch .toggle-label::before {content: "";\nposition: absolute;\nwidth: 20px;\nheight: 20px;\nborder-radius: 50%;\ntop: 2px;\nleft: 2px;\nbackground-color: #fff;\nbox-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);\ntransition: transform 0.3s;}\n.toggle-switch .toggle-input:checked + .toggle-label {background-color: #4CAF50;}\n.toggle-switch .toggle-input:checked + .toggle-label::before {transform: translateX(16px);}\n.toggle-switch.light .toggle-label {background-color: #BEBEBE;}\n.toggle-switch.light .toggle-input:checked + .toggle-label {background-color: #9B9B9B;}\n.toggle-switch.light .toggle-input:checked + .toggle-label::before {transform: translateX(6px);}\n.toggle-switch.dark .toggle-label {background-color: #4B4B4B;}\n.toggle-switch.dark .toggle-input:checked + .toggle-label {background-color: #717171;}\n.toggle-switch.dark .toggle-input:checked + .toggle-label::before {transform: translateX(16px);}`);
                break; 
            case "loader": 
                setHtmlCode(`<div class="loader"></div>`);
                setCssCode(`.loader {\nborder: 10px solid #f3f3f3;\nborder-top: 10px solid #3498db;\nborder-radius: 50%;\nwidth: 30px;\nheight: 30px;\nanimation: spin 2s linear infinite;\n}\n@keyframes spin {\n0% { transform: rotate(0deg); }\n100% { transform: rotate(360deg); }\n}`);
                break;
            case "radio" :
                setHtmlCode(`<div>\n<label>\n<input type="radio" name="choice" value="option1" checked> Option 1\n</label>\n<label>\n<input type="radio" name="choice" value="option2"> Option 2\n</label>\n</div>\n`);
                setCssCode(`div {\ndisplay: flex; \ngap: 10px; \npadding: 10px; \n}\nlabel { \ncursor: pointer; \ncolor : white\n}\ninput[type="radio"] { \naccent-color: teal; \nmargin-right: 5px; \n}`);
                break;
            case "input" :
                setHtmlCode(`<input type="text" placeholder="Enter your name">`);
                setCssCode(`input[type="text"] {\npadding: 10px;\nborder: 1px solid #ddd;\nborder-radius: 5px;\n}`);
                break;
            case "check" :
                setHtmlCode(`<div>\n<label>\n<input type="checkbox" name="choice" value="option1" checked> Option 1\n</label>\n<label>\n<input type="checkbox" name="choice" value="option2"> Option 2\n</label>\n</div>\n`);
                setCssCode(`div {\ndisplay: flex; \ngap: 10px; \npadding: 10px; \n}\nlabel { \ncursor: pointer; \ncolor : white\n}\ninput[type="checkbox"] { \naccent-color: teal; \nmargin-right: 5px; \n}`);      
                break;
            default:
                logout();
                navigateTo("/login",{state : {text : "Login"}});
                break;
        }           
    }, [location.state]);

    const handleHtmlChange = (value) => {
       setHtmlCode(value);
    };

    const handleCssChange = (value) => {
        setCssCode(value);
    };

    const copyToClipboard = async () => {
        try {
            if(activeTab == "html") await navigator.clipboard.writeText(htmlCode);
            else await navigator.clipboard.writeText(cssCode);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); 
        } catch (err) {
          console.error("Failed to copy:", err);
        }
    };

    const handleDraft = async ()=>{

        try{
            setLoadingForDraft(true);
            if(username == null || token == null) {
                logout();
                navigateTo("/login",{state : {text : "Login"}});
            } 

            const response = await fetch("https://elementx-7ure.onrender.com/saveDraft",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : token
                },
                body : JSON.stringify({
                    html : htmlCode,
                    css : cssCode,
                    username : username,
                    category : create
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error:", errorData.message);
                return;
              }
              setPopup(true);
              setMessage("Your Creation Saved in Draft!");
              setDescription("You can view it in the Profile tab, and it will be automatically deleted after 7 days.");
              setLoadingForDraft(false);
        }catch(e)
        {
            setLoadingForDraft(false);
            console.log("Inter server error");
        }
    }

       useEffect(()=>{
        if(!on) setColor("#e8e8e8");
        else setColor("#333");
       },[on]);
    
    return (
        <div className="create-code-body" id="restricted-area">
            {
                ReactDOM.createPortal(popup ? <Popup 
                    html={htmlCode} 
                    css={cssCode} 
                    setPopup={setPopup} 
                    background={color}
                    category = {create}
                />
                    : null, document.body)
            }
            <div onClick={() => navigateTo(-1)} className="create-code-back-button">
                <MdKeyboardBackspace style={{ fontSize: "2vw" }} />
                Go Back
            </div>
            <div className="create-code-container">
                <div className="create-code-output" style={{backgroundColor : color}}>
                <div className="getcode-code-color-changer" >
                    <input value={color} onChange={(e)=>setColor(e.target.value)} type="color"></input>
                </div>
                <div className="get-code-switch">
                <label class="toggle-switch">
                    <input onChange={()=>setOn(!on)} type="checkbox" />
                    <span class="slider"></span>
                </label>
                </div>
                    <Data html={htmlCode} css={cssCode}/>
                </div>

                <div className="create-code-input">
                    <div className="create-code-navbar">
                        <button
                            onClick={() => setActiveTab("html")}
                            className={
                                activeTab === "html"
                                    ? "create-code-active-button"
                                    : "create-code-inactive-button"
                            }
                        >
                        
                            <img style={{ height: "20px" }} src="./html.png"/>HTML
                        </button>
                        <button
                            onClick={() => setActiveTab("css")}
                            className={
                                activeTab === "css"
                                    ? "create-code-active-button"
                                    : "create-code-inactive-button"
                            }
                        >
                            <img style={{ height: "25px" }} src="./css.png" />CSS
                        </button>
                        <button onClick={copyToClipboard} className="getcode-code-copy-button">{
                            isCopied ? <><FcCheckmark />Copied</> : 
                            <><IoCopyOutline />Copy</>}</button>
                    </div>
                    <div className="create-code-input-body">
                            <CodeMirror className="textarea" style={{display : activeTab === "html" ? "block" : "none"}}
                                value={htmlCode}
                                theme={dracula}
                                extensions={[html(),transparentTheme,EditorView.lineWrapping]}
                                
                                onChange={(value) => handleHtmlChange(value)}
                            />
                            <CodeMirror className="textarea" style={{display : activeTab === "css" ? "block" : "none"}}
                                value={cssCode}
                                theme={dracula}
                                extensions={[css(),transparentTheme,EditorView.lineWrapping]}
                                onChange={(value) => handleCssChange(value)}
                            />
                    </div>
                </div>
            </div>
            
                <div className="create-code-bottum">
                <div className="create-code-bottum-info">
                    <div className="create-category-info">Category : {create}</div>
                    <div className="create-code-buttons">
                        <button onClick={()=>setPopup(true)}>{loading ? <Loader /> : "Submit for review"}</button>
                        <button onClick={handleDraft}>{loadingForDraft ? <Loader /> : "Save Draft"}</button>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Create;
