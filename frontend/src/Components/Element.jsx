import React, { useState, useEffect, useContext, useRef } from 'react';
import SideBar from './SideBar';
import './../Css/Element.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { FcFilledFilter } from "react-icons/fc";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { LiaRandomSolid } from "react-icons/lia";
import { VscSortPrecedence } from "react-icons/vsc";
import { IoReceiptOutline } from "react-icons/io5";
import { FaRegGrinHearts } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { AuthContext } from '../Autherization';
import Loader from './Loader';
import BigProductCard from './BigProductCard';
import ProductCard from './ProductCard';


const Element = () => {
    const { username } = useContext(AuthContext);
    const scrolRef = useRef(null);
    const [active, setActive] = useState("all");
    const [loading, setLoading] = useState(true);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const initialCategoryState = { array: [], pageNumber: 0, lastPage: false, sortBy: "random" };

    const [all, setAll] = useState(initialCategoryState);
    const [button, setButton] = useState(initialCategoryState);
    const [input, setInput] = useState(initialCategoryState);
    const [form, setForm] = useState(initialCategoryState);
    const [card, setCard] = useState(initialCategoryState);
    const [loader, setLoader] = useState(initialCategoryState);
    const [toggleSwitch, setToggleSwitch] = useState(initialCategoryState);
    const [radioButton, setRadioButton] = useState(initialCategoryState);
    const [checkBox, setCheckBox] = useState(initialCategoryState);

    const [sortBy, setSortBy] = useState("Randomized");
    const [select, setSelect] = useState(false);
    const [miniSidebar,setMiniSideBar] = useState(false);

    const categoryStateMap = {
        all: { state: all, setState: setAll },
        button: { state: button, setState: setButton },
        input: { state: input, setState: setInput },
        form: { state: form, setState: setForm },
        card: { state: card, setState: setCard },
        loader: { state: loader, setState: setLoader },
        switch: { state: toggleSwitch, setState: setToggleSwitch },
        radio: { state: radioButton, setState: setRadioButton },
        check: { state: checkBox, setState: setCheckBox }
    };

    const getSortParam = () => {
        switch (sortBy) {
            case "Randomized":
                return "random";
            case "Newest First":
                return "newest";
            case "Oldest First":
                return "oldest";
            case "Most Liked":
                return "mostLiked";
            case "Liked by me":
                return "likedByUser";
            default:
                return "random";
        }
    };

    const fetchData = async (currentSort,currentPage) => {
        const offset = currentPage*30;
        const response = await fetch(`https://elementx-7ure.onrender.com/get${active}/${currentSort}/${offset}/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return null;
    };

    const loadMore = async (currentState, setState, page, currentSort) => {      
      setLoading(true);
      const result = await fetchData(currentSort, page);
      if (result) {
          setState(prevState => ({
              ...prevState,
              array: [...prevState.array, ...result.data],
              pageNumber: page,
              lastPage: result.lastPage,
              sortBy: currentSort
          }));
      }
      setLoading(false);
  };
  

    useEffect(() => {
        if (categoryStateMap[active]) {
            const {state,setState} = categoryStateMap[active];
            if (state.array.length === 0) {
                loadMore(state, setState,0,state.sortBy);
            }
        }
    }, [active]);

    const updateSort = async () => {
      const newSort = getSortParam();
      const { state, setState } = categoryStateMap[active];
      const updatedState = { array: [], pageNumber: 0, lastPage: false, sortBy: newSort };
      setState(updatedState);
      await loadMore(updatedState, setState, 0, newSort);
    };

    useEffect(() => {
        if (isFirstLoad) {
            setIsFirstLoad(false);
            return;
        }
        updateSort();
    },[sortBy]);


    const navigateTo = useNavigate();

    return (
        <div className='element-container1'>
          <div className='sidebar-position desktop-only'>
            <SideBar active={active} setActive={setActive} />
        </div>
      { 
      <div ref={scrolRef} className='element-card-container' id='restricted-area'>
        <div className='element-navbar'>
          <button className='back-button desktop-only' onClick={() => navigateTo(-1)}>
            <FaArrowLeftLong />Go Back
          </button>
          <div className='element-navbar-subnavbar'>
            <div onClick={()=>setMiniSideBar(!miniSidebar)} className='element-page-heading'>
              category &nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp; {active}
              <div className='mobile-only'>
                {miniSidebar ? <FaAngleUp style={{color : "white"}}/> : <FaAngleDown style={{color : "white"}}/>}  
              </div>
              {
                miniSidebar && 
                <div className='mini-sidebar mobile-only'>
                  <div 
                  onClick={()=>setActive("all")}
                  style={{color : active == "all" ? "rgb(77,175,200)" : "white"}}>All</div>
                  <div onClick={()=>setActive("button")} style={{color : active == "button" ? "rgb(77,175,200)" : "white"}}>Button</div>
                  <div onClick={()=>setActive("form")} style={{color : active == "form" ? "rgb(77,175,200)" : "white"}}>Form</div>
                  <div onClick={()=>setActive("card")} style={{color : active == "card" ? "rgb(77,175,200)" : "white"}}>Card</div>
                  <div onClick={()=>setActive("check")} style={{color : active == "check" ? "rgb(77,175,200)" : "white"}}>Check Box</div>
                  <div onClick={()=>setActive("input")} style={{color : active == "input" ? "rgb(77,175,200)" : "white"}}>Inputs</div>
                  <div onClick={()=>setActive("loader")} style={{color : active == "loader" ? "rgb(77,175,200)" : "white"}} >Loaders</div>
                  <div onClick={()=>setActive("radio")} style={{color : active == "radio" ? "rgb(77,175,200)" : "white"}} >Radio</div>
                  <div onClick={()=>setActive("switch")} style={{color : active == "switch" ? "rgb(77,175,200)" : "white"}}>Switches</div>
                </div>
              }
              
            </div>

            <div className='element-sort' onClick={() => setSelect(!select)}>
              <FcFilledFilter />
              &nbsp; Sort By :&nbsp;&nbsp;&nbsp; 
              <div className='selected'>
                {categoryStateMap[active].state.sortBy == "random" && "Randomized"}
                {categoryStateMap[active].state.sortBy == "newest" && "Newest first"}
                {categoryStateMap[active].state.sortBy == "oldest" && "Oldest first"}
                {categoryStateMap[active].state.sortBy == "mostLiked" && "Most liked"}
                {categoryStateMap[active].state.sortBy == "likedByUser" && "Liked by me"}
                &nbsp;&nbsp;
                {select ? <FaAngleUp /> : <FaAngleDown />}
              </div>
              <div style={{ display: select ? "flex" : "none" }} className='dropdown-options'>
                <div className='element-option' style={{color : categoryStateMap[active].state.sortBy == "random" ? "rgb(77,175,200)" : "white"}} onClick={() => setSortBy("Randomized")}>
                  <LiaRandomSolid />Randomized
                </div>
                <div className='element-option' style={{color : categoryStateMap[active].state.sortBy == "newest" ? "rgb(77,175,200)" : "white"}} onClick={() => setSortBy("Newest First")}>
                  <IoReceiptOutline />Newest first
                </div>
                <div className='element-option' style={{color : categoryStateMap[active].state.sortBy == "oldest" ? "rgb(77,175,200)" : "white"}} onClick={() => setSortBy("Oldest First")}>
                  <VscSortPrecedence />Oldest First
                </div>
                <div className='element-option' style={{color : categoryStateMap[active].state.sortBy == "mostLiked" ? "rgb(77,175,200)" : "white"}} onClick={() => setSortBy("Most Liked")}>
                  <FaRegGrinHearts />Most Liked
                </div>
                <div className='element-option' style={{color : categoryStateMap[active].state.sortBy == "likedByUser" ? "rgb(77,175,200)" : "white"}} onClick={() => setSortBy("Liked by me")}>
                  <FaHeart />Liked by me
                </div>
              </div>
            </div>
          </div>         
        </div>
        <div className='element-cards'>
        {  
            categoryStateMap[active].state.array?.map((element) => (
                (element.category !== "form" && element.category !== "card") ? <ProductCard
                key={element._id} 
                html = {element.html}
                css={element.css}
                id={element._id}
                show = {true}
                likedPeople={element.likedPeople}
                username={element.username}
                background={element.background}
                /> : <BigProductCard 
                key={element._id} 
                html = {element.html}
                css={element.css}
                id={element._id}
                show = {true}
                likedPeople={element.likedPeople}
                username={element.username}
                background={element.background}
                />
            ))
        }
        </div>
        <div className='more-button'>
          {
            categoryStateMap[active].state.lastPage ? 
            <div className="no-element-found">
                <img src="end1.png" alt="Image" />
                <div className="no-element-text">
                    <div >It Looks Like <br />You've seen everything!</div>
                    <button onClick={()=>scrolRef.current.scrollTop = 0}>Go to Top</button>    
                </div>
            </div> : 
              <button 
              onClick={()=>{
                const { state, setState } = categoryStateMap[active];
                loadMore(state, setState, state.pageNumber + 1, state.sortBy);
              }}
              >{loading ? <Loader /> : "More Element"}</button>
          }
          </div>
      </div>
      }
    </div>
    );
};

export default Element;