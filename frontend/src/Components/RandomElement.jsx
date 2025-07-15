
import "./../Css/RandomElement.css";
import { useRef, useState, useEffect } from "react";
import Data from './Data';
import { useNavigate } from "react-router-dom";
const RandomElement = () => {

  const navigateTo = useNavigate();

  const [data, setData] = useState([
    {
      html: `<button class="simple-button">\nClick Me\n</button>`,
      css: `.simple-button {\nbackground-color: lightblue;\nborder: none;\npadding: 10px 20px;\nfont-size: 16px;\nborder-radius: 5px;\ncursor: pointer;\ntransition: background-color 0.3s;\n}\n.simple-button:hover {\nbackground-color: deepskyblue;\n}`,
      category: "button",
      background: `#333`
    },
    {
      category: "card",
      html: `<div class="simple-card">\n<h3 class="card-title">Card Title</h3>\n<p class="card-description">This is a simple card description to showcase card content.</p>\n<button class="card-button" onclick="alert('Button Clicked!')">Learn More</button>\n</div>`,
      css: `.simple-card {\nborder: 1px solid #ddd;\nborder-radius: 10px;\npadding: 20px;\nwidth: 250px;\ntext-align: center;\nbackground-color: #f9f9f9;\nbox-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n}\n.card-image {\nwidth: 100%;\nborder-radius: 10px;\nmargin-bottom: 15px;\n}\n.card-title {\nfont-size: 18px;\nfont-weight: bold;\nmargin: 10px 0;\n}\n.card-description {\nfont-size: 14px;\ncolor: #555;\nmargin-bottom: 15px;\n}\n.card-button {\nbackground-color: lightblue;\nborder: none;\npadding: 10px 15px;\nfont-size: 14px;\nborder-radius: 5px;\ncursor: pointer;\ntransition: background-color 0.3s;\n}\n.card-button:hover {\nbackground-color: deepskyblue;\n}`,
      background: "#333"
    },
    {
      category: "form",
      html: `<form class="simple-form">\n<label for="name">Name:</label>\n<input type="text" placeholder="Enter your name">\n<button type="submit">Submit</button>\n</form>`,
      css: `.simple-form {\ndisplay: flex;\nflex-direction: column;\nwidth: 300px;\nmargin: 20px auto;\npadding: 20px;\nborder: 1px solid lightgray;\nborder-radius: 5px;\nbackground-color: #f9f9f9;\n}\n.simple-form input {\npadding: 10px;\nmargin: 10px 0;\nborder: 1px solid #ddd;\nborder-radius: 5px;\n}\n.simple-form button {\nbackground-color: lightblue;\nborder: none;\npadding: 10px 20px;\nfont-size: 16px;\nborder-radius: 5px;\ncursor: pointer;\ntransition: background-color 0.3s;\n}\n.simple-form button:hover {\nbackground-color: deepskyblue;\n}`,
      background: "#333"
    }
  ]);

  
    const handleNavigation = (id)=>{
        alert("cleick");
        navigateTo(`/getcode/${id}`);
    }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://elementx-7ure.onrender.com/getRandomElements', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const myMap = new Map();

  data?.map((item) => {
    myMap.set(item.category, item);
  })



  return (
    <div className="random-element-container">
      <div
        className="random-element desktop-only">
        <div className="random-element-form-loader-container">
          <div className="random-element-block">
            {
              <div className="random-element-form-card" 
              style={{ background: myMap.get("form")?.background }}>
                <Data html={myMap.get("form")?.html} css={myMap.get("form")?.css} />
              </div>
            }
            <div className="random-element-text">Forms</div>
          </div>
        </div>
        <div className="random-element-switch-text-container">

          <div className="random-element-block">
            {
              <div className="random-element-switch-card" style={{ background: myMap.get("switch")?.background }}>
                <Data html={myMap.get("switch")?.html} css={myMap.get("switch")?.css} />
              </div>
            }
            <div className="random-element-text">Switch</div>
          </div>
          <div className="random-element-block">
            <div className="random-element-heading-conatainer">
              <div className="random-element-heading">Make <span>It</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Yours</div>
            </div>

          </div>

        </div>
        <div className="random-element-button-card-input-container">
          <div className="random-element-button-card-container">
            <div className="random-element-block">

              {
                <div className="random-element-button-card" style={{ background: myMap.get("button")?.background }}>
                  <Data html={myMap.get("button")?.html} css={myMap.get("button")?.css} />
                </div>
              }
              <div className="random-element-text">Buttons</div>
            </div>
            <div className="random-element-block">
              {
                <div className="random-element-card-card" style={{ background: myMap.get("card")?.background }}>
                  <Data html={myMap.get("card")?.html} css={myMap.get("card")?.css} />
                </div>
              }
              <div className="random-element-text card">Cards</div>
            </div>
          </div>
          <div className="random-element-input-card-container">
            <div className="random-element-block">
              {
                <div className="random-element-input-card notextra" style={{ background: myMap.get("input")?.background }}>
                  <Data html={myMap.get("input")?.html} css={myMap.get("input")?.css} />
                </div>
              }
              <div className="random-element-text">Inputes</div>
            </div>
            <div className="random-element-block">
              {
                <div className="random-element-input-card extra" style={{ background: myMap.get("loader")?.background }}>
                  <Data html={myMap.get("loader")?.html} css={myMap.get("loader")?.css} />
                </div>
              }
              <div className="random-element-text">Loaders</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile-view">
          <div className="random-element-mobile-element">
              <div className="random-element-mobile-content">
                  <Data html={data[0].html} css={data[0].css}/>
              </div>
              <div className="random-element-mobile-category">{data[0].category}</div>
              <div className="random-element-heading-conatainer">
              <div className="random-element-heading">Make <span>It</span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Yours</div>
            </div>
          </div>

      </div>
    </div>
  );
}

export default RandomElement;