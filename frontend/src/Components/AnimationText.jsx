import React, { useEffect, useState } from 'react';
import { ImSearch } from 'react-icons/im';
import { BsStars } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const textItems = ['Buttons', 'Forms', 'Cards', 'Loaders', 'Radio Buttons', 'Toggle Switches', 'Check Boxes'];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const AnimationText = ()=>{
    const [animatedText, setAnimatedText] = useState('');
    const [input,setInput] = useState("");

    const navigateTo = useNavigate();

    useEffect(() => {
        let isActive = true;

        const animateText = async () => {
            let index = 0;

            while (isActive) {
                const text = textItems[index];
                for (let i = 0; i <= text.length; i++) {
                    if (!isActive) break;
                    setAnimatedText(text.slice(0, i));
                    await delay(100);
                }
                for (let i = text.length; i >= 0; i--) {
                    if (!isActive) break;
                    setAnimatedText(text.slice(0, i));
                    await delay(100);
                }
                index = (index + 1) % textItems.length;
            }
        };

        animateText();
        return () => {
            isActive = false;
        };
    }, []);

    const handleSearch = () => {
        if (input.trim() === "") {
            return;
        }
        navigateTo("/search?query="+input);
    }

    return(
        <>
            <div className="uppercon-left">
                <h1 className="heading1">Open-Source</h1>
                <h1 className="subheading">UI Building Blocks</h1>
                <h1 className="heading2">
                    We Provide <span>{animatedText}|</span>
                </h1>
                <h2 className="heading3">
                    Create, Share & Use <span className="beautiful">
                        <BsStars /> Beautiful
                    </span>{' '}
                    Custom <br /> Elements Made With CSS
                </h2>

                <div className="main-input">
                    <div className="input-container">
                        <input
                            className="input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            type="text"
                            onKeyDown={(e)=>e.key === 'Enter' && handleSearch()}
                            placeholder="Search for UI elements, creators..."
                            required
                        />
                        <button 
                        onClick={handleSearch}
                        type="button" className="searchButton">
                            <ImSearch className="search-icon" />
                            &nbsp;&nbsp;&nbsp;Search
                        </button>
                    </div>
                </div>
            </div>    
        </>
    )
}

export default AnimationText;