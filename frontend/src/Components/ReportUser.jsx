import "./../Css/ReportUser.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState,useEffect } from "react";
import { AuthContext } from '../Autherization';
import { useContext } from "react";
import {useNavigate} from "react-router-dom";
import Loader from "./Loader";
const ReportUser = ({id,setIsReport,reportTo,reportFrom}) => {
  const navigateTo = useNavigate();
  const {token,login} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    if(!login)
    {
      navigateTo("/login");
    }
  },[]);


  const handleReport = async () => {
    setLoading(true);
     const response = await fetch("https://elementx-7ure.onrender.com/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : token
      },
      body: JSON.stringify({
        id,
        reason: input,
        reportTo,
        reportFrom
      }),
     });
      setLoading(false);
     if(response.ok)
     {
        alert("User reported successfully");
        setIsReport(false);
     }
     else {
        const data = await response.json();
        alert(data.message || "Something went wrong");
        setIsReport(false);
     }
  }

  const [input,setInput] = useState("");
  return (
    <div className="report-container">
      <div className="report-heading">Report User
        <span onClick={()=>setIsReport(false)} className="report-close"><IoIosCloseCircleOutline /></span>
      </div>
      <div className="report-content">
        <textarea 
        placeholder="Please provide a strong reason for reporting this user...."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="report-buttons">
        <button onClick={()=>setIsReport(false)} className="report-cancel-button">Cancel</button>
        <button onClick={handleReport} className="report-report-button">{loading ? <Loader /> : "Report"}</button>
      </div>
      

    </div>
  );
};

export default ReportUser;
