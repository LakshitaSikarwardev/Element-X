import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { EditorView } from "@codemirror/view";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { IoCopyOutline } from "react-icons/io5";
import "./../Css/Getcode.css";
import { FcCalendar } from "react-icons/fc";
import { FcCheckmark } from "react-icons/fc";
import Data from './Data';
import { AuthContext } from '../Autherization';
import { FcLike } from "react-icons/fc";
import { FcLikePlaceholder } from "react-icons/fc";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import { AiOutlineFileDone } from "react-icons/ai";
import ReactDOM from 'react-dom';
import ReportUser from './ReportUser';
import { FcEmptyTrash } from "react-icons/fc";
import { FcExternal } from "react-icons/fc";
import { FcOk } from "react-icons/fc";
import { FaEye } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import Footer from './Footer';

const GetCode = () => {
    const [isfirst, setIsFirst] = useState(true);
    const { id } = useParams();
    const [htmlCode, setHtmlCode] = useState("");
    const [cssCode, setCssCode] = useState("");
    const [activeTab, setActiveTab] = useState("html");
    const [color, setColor] = useState("#e8e8e8");
    const [username, setUsername] = useState("Username");
    const [date, setDate] = useState("");
    const navigateTo = useNavigate();
    const [on, setOn] = useState(true);
    const [likes, setLikes] = useState(0);
    const [category, setCategory] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [creator, setCreator] = useState("original");
    const [creationLink, setCreationLink] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likedPeople, setLikedPeople] = useState([]);
    const { username: user, token } = useContext(AuthContext);
    const [scroll, setScroll] = useState(false);
    const [changeIn, setChangeIn] = useState("");
    const scrollRef = useRef(null);
    const [isReport, setIsReport] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [preview, setPreview] = useState("both");

    const transparentTheme = EditorView.theme({
        "&": { backgroundColor: "transparent !important", border: "none !important" },
        ".cm-scroller": { backgroundColor: "transparent !important" },
        ".cm-content": { backgroundColor: "transparent !important" },
        ".cm-gutters": { backgroundColor: "transparent !important", borderRight: "none !important" },
        ".cm-activeLine": { backgroundColor: "transparent !important" },
        ".cm-activeLineGutter": { backgroundColor: "transparent !important" },
        ".cm-lineNumbers": { color: "white !important" },
        ".cm-content::after": { display: "none" }
    }, { dark: true });

    useEffect(() => {
        if (window.innerWidth > 768) {
            setPreview("both");
        }else {            
            setPreview("preview");
        }
    }, []);


    const ai = async () => {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "deepseek/deepseek-r1-zero:free",
                    "messages": [
                        {
                            "role": "user",
                            "content": `convert this html and css code into a tailwind component and make sure that 
                      please only write react component code and nothing else.
                      html : ${htmlCode}
                      css : ${cssCode}  
                      `
                        }
                    ]
                })
            });
            if (response.ok) {
                const data = await response.json();
                setChangeIn(data.choices?.[0]?.message?.content);
            }
        } catch (e) {
            console.log("internal server error");
        }
    }

    const handleDelete = () => {
        setDeleteModel(true);
        window.scrollTo(0, document.body.scrollHeight);
    }

    const handleUpdate = async () => {
        const response = await fetch("https://elementx-7ure.onrender.com/updateElement", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                html: htmlCode,
                css: cssCode,
                id: id,
                background: color
            })
        });
        if (response.ok) {
            setUpdated(true);
            const intervalID = setTimeout(() => {
                setUpdated(false);
            }, 5000);
        }
    }

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
            const response = await fetch(`https://elementx-7ure.onrender.com/like/${id}`, {
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

    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await fetch(`https://elementx-7ure.onrender.com/getElementByID/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.ok) {

                    const data = await response.json();
                    setHtmlCode(data.html);
                    setCssCode(data.css);
                    setUsername(data.username);
                    const dateObject = new Date(data.createdAt);
                    setDate(dateObject.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }));
                    setLikes(data.likedPeople.length);
                    setCategory(data.category);
                    setColor(data.background);
                    setCreator(data.creator);
                    setCreationLink(data.creationLink);
                    setLikedPeople(data.likedPeople);
                }
            }
            fetchData();
        } catch (e) {
            console.log("internal server errro");
        }
    }, [id])

    const handleScroll = e => {
        setScroll(e.currentTarget.scrollTop > 0)
    }

    useEffect(() => {
        if (isfirst) {
            setIsFirst(false);
            return;
        }
        if (!on) setColor("#e8e8e8");
        else setColor("#333");
    }, [on]);

    const copyToClipboard = async () => {
        try {
            if (activeTab == "html") await navigator.clipboard.writeText(htmlCode);
            else await navigator.clipboard.writeText(cssCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const deletePost = async () => {
        console.log(token);
        const response = await fetch("https://elementx-7ure.onrender.com/deleteElement", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ id })

        });
        if (response.ok) {
            navigateTo("/profile/" + user);
            window.scrollTo(0, 0);
        }
    }

    return (
        <div className="getcode-code-body" id="restricted-area">
            {
                isReport && ReactDOM.createPortal(
                    <ReportUser
                        id={id}
                        reportTo={username}
                        reportFrom={user}
                        setIsReport={setIsReport}
                    />, document.body
                )
            }
            {
                deleteModel && ReactDOM.createPortal(
                    <div className="delete-model">
                        <div className="delete-content">
                            <div className="delete-output" style={{ background: color }}>
                                <Data html={htmlCode} css={cssCode} />
                            </div>
                            <div className="delete-info">
                                <div className="delete-heading">Do you really want to delete this post ?</div>
                                <div className="delete-subheading">⚠️ Warning: This action will permanently delete the item and cannot be undone.</div>
                                <div className="delete-buttons">
                                    <button onClick={deletePost} className="delete-button"><FcEmptyTrash style={{ fontSize: "1.5vw" }} />Delete Post</button>
                                    <button onClick={() => {
                                        setDeleteModel(false);
                                        window.scrollTo(0, 0);
                                    }} className="delete-cencel-button">Cencel</button>
                                </div>

                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            <div className="getcode-code-back-button">
                <div className="back-button" onClick={() => navigateTo(-1)}>
                    <MdKeyboardBackspace style={{ fontSize: "1.5em" }} />
                    Go Back
                </div>
                <div className="code-preview-button">
                    <input type="radio" name="preview-code" id="preview"
                        value="preview"
                        checked={preview == "preview"}
                        onChange={(e) => setPreview(e.target.value)}
                    />
                    <label htmlFor="preview"><FaEye />Preview</label>

                    <input type="radio" name="preview-code" id="code"
                        value="code"
                        checked={preview == "code"}
                        onChange={(e) => setPreview(e.target.value)}
                    />
                    <label htmlFor="code"><FaCode />Code</label>
                </div>

            </div>

            <div className="getcode-code-container">
                <div className="getcode-code-output" style={{
                    backgroundColor: color,
                    display: preview == "code" ? "none" : "block"
                }} >
                    <div className="getcode-code-color-changer">
                        <input value={color} onChange={(e) => setColor(e.target.value)} type="color"></input>
                    </div>
                    <div className="get-code-switch">
                        <label class="toggle-switch">
                            <input onChange={() => setOn(!on)} type="checkbox" />
                            <span class="slider"></span>
                        </label>
                    </div>
                    <Data html={htmlCode} css={cssCode} />
                </div>

                <div className="getcode-code-input" style={{
                    display: preview == "preview" ? "none" : "block"
                }}>
                    <div className="getcode-code-navbar">
                        <button
                            onClick={() => setActiveTab("html")}
                            className={
                                activeTab === "html"
                                    ? "getcode-code-active-button"
                                    : "getcode-code-inactive-button"
                            }
                        >
                            <img style={{ height: "20px" }} src="../html.png" />HTML
                        </button>
                        <button
                            onClick={() => setActiveTab("css")}
                            className={
                                activeTab === "css"
                                    ? "getcode-code-active-button"
                                    : "getcode-code-inactive-button"
                            }
                        >
                            <img style={{ height: "25px" }} src="../css.png" />CSS
                        </button>
                        <button onClick={copyToClipboard} className="getcode-code-copy-button">{
                            isCopied ? <><FcCheckmark />Copied</> :
                                <><IoCopyOutline />Copy</>}</button>
                    </div>
                    <div className="getcode-code-input-body">
                        <CodeMirror
                            style={{ display: activeTab === "html" ? "block" : "none" }}
                            className="textarea"
                            extensions={[
                                html(),
                                transparentTheme,
                                oneDark,
                                EditorView.lineWrapping
                            ]}
                            value={htmlCode}
                            onChange={(value) => setHtmlCode(value)}
                        />
                        <CodeMirror
                            style={{ display: activeTab === "css" ? "block" : "none" }}
                            className="textarea"
                            extensions={[
                                css(),
                                transparentTheme,
                                oneDark,
                                EditorView.lineWrapping
                            ]}
                            value={cssCode}
                            onChange={(value) => setCssCode(value)}
                        />
                    </div>

                </div>
            </div>
            {
                username === user &&
                <div className="getcode-own-buttons">
                    <button onClick={handleDelete}><FcEmptyTrash style={{ fontSize: "1.5em" }} />Delete Post</button>
                    <button onClick={handleUpdate}>{updated ? <><FcOk style={{ fontSize: "1.5em" }} />Updated</> : <><FcExternal style={{ fontSize: "1.5em" }} />Update Post</>}</button>
                </div>
            }

            <div

                className="getcode-bottum">
                <div className="getcode-bottum-container">
                    <div className="getcode-profile-info" onClick={() => navigateTo("/profile/" + username)}>
                        <div className="getcode-profile-image"></div>
                        {
                            creator === "original" ?
                                <div className="getcode-profile-name">Created By : {username}</div> :
                                <div className="getcode-profile-name2">
                                    <div className="getcode-profile-name">{creator} By : {username}</div>
                                </div>

                        }
                        <div className="getcode-date"><FcCalendar style={{ fontSize: "6vh" }} />{date}</div>
                    </div>
                    <div className="getcode-other">
                        <div className="getcode-category-like-container">
                            <div className="getcode-category">{category}</div>
                            <div className="getcode-likes" onClick={toggleLiked}>{isLiked ? <FcLike style={{ fontSize: "x-large", cursor: "pointer" }} /> : <FcLikePlaceholder style={{ fontSize: "x-large", cursor: "pointer" }} />}{likes}</div>
                        </div>
                        <div className="getcode-report">
                            {
                                creator !== "original" && <a href={creationLink} target="blank">Click Here to see original creator</a>
                            }

                            <button onClick={() => setIsReport(true)} className="report-button"><span><MdOutlineReportGmailerrorred style={{ fontSize: "3vh" }} />Report User</span></button>
                        </div>
                    </div>
                </div>
                <div className="getcode-licence">
                    <div className="getcode-licence-heading">
                        <AiOutlineFileDone style={{ fontSize: "4vh" }} />MIT License
                    </div>
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        style={{
                            borderTop: scroll && "1px solid white"
                        }}
                        className="getcode-licence-body">
                        MIT License<br /><br />
                        Copyright (c) 2025 ElementX Team<br /><br />
                        Permission is hereby granted, free of charge, to any person obtaining a copy
                        of this software and associated documentation files (the “Software”), to deal
                        in the Software without restriction, including without limitation the rights
                        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                        copies of the Software, and to permit persons to whom the Software is
                        furnished to do so, subject to the following conditions:
                        <br /><br />
                        The above copyright notice and this permission notice shall be included in
                        all copies or substantial portions of the Software.
                        <br /><br />
                        THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                        THE SOFTWARE.
                        <br /><br />
                    </div>

                </div>
                
            </div>
            <Footer />
        </div>
    );
};

export default GetCode;
