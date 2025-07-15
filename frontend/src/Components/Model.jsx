import './../Css/Model.css';
import { AiFillHome, AiOutlineCreditCard, AiFillCheckCircle } from 'react-icons/ai';
import { CgPlayButtonO, CgMoreVertical } from 'react-icons/cg';
import { VscOutput } from 'react-icons/vsc';
import { LuTextCursorInput } from 'react-icons/lu';
import { TbLoader3 } from 'react-icons/tb'
import { BsUiRadiosGrid, BsToggles } from 'react-icons/bs'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";

const Model = ({setModel})=>{
	const [active,setActive] = useState("button");
	const navigateTo = useNavigate();

	const activeCss = {
		border : "2px solid aqua",
		boxShadow : "0px 0px 1px aqua",
		transform : "scale(1.1)"
	}

	const handleCreateRequest = ()=>{
		setModel(false);
		navigateTo("/create",{state : {create : active}});
	}

	const handleClose = ()=>{
		setModel(false);
		window.scrollTo(0,0);
	}


	return(
		<>
		<div className='model-body' onClick={()=>setModel(false)}>
			<div className='model-content' onClick={(e)=>e.stopPropagation()}>
					<div className='close-button' onClick={handleClose}><IoIosCloseCircleOutline /></div>
					<div className='model-heading'>What are you making?</div>
				<div className='model-items'>
						<label onClick={()=>setActive("button")} style={active == "button" ? activeCss : null} ><CgPlayButtonO className='symbols'/>Button</label>
						<label onClick={()=>setActive("form")} 	style={active == "form" ? activeCss : null}><VscOutput className='symbols' />Form</label>
						<label onClick={()=>setActive("card")} 	style={active == "card" ? activeCss : null}><AiOutlineCreditCard className='symbols' />Card</label>
						<label onClick={()=>setActive("switch")} style={active == "switch" ? activeCss : null}><BsToggles className='symbols' />Toggle Switche</label>
						<label onClick={()=>setActive("radio")} style={active == "radio" ? activeCss : null}><BsUiRadiosGrid className='symbols' />Radio Button</label>
						<label onClick={()=>setActive("loader")} style={active == "loader" ? activeCss : null}><TbLoader3 className='symbols' />Loader</label>
						<label onClick={()=>setActive("input")} style={active == "input" ? activeCss : null}><LuTextCursorInput className='symbols' />Input</label>
						<label onClick={()=>setActive("check")} style={active == "check" ? activeCss : null}><AiFillCheckCircle className='symbols' />Check Boxes</label>
				</div>
				<div>
					<button className='create-button' onClick={handleCreateRequest}>Create</button>
				</div>
			</div>
		</div>
		</>
		)
}

export default Model;