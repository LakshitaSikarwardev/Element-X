import './../Css/Login.css';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useContext } from 'react';
import { AuthContext } from '../Autherization';
import Loader from './Loader';
import Footer from "./Footer";

const Login = () => {
  const location = useLocation();
  const navigateTo = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const login = useRef();
  const { text = "Login" } = location.state || {};
  const [errorMessage, setErrorMessage] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {doLogin, doRegister,emailVerify} = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [emailModel, setEmailModel] = useState(false);
  const [emailError,setEmailError] = useState("");
  const [loader,setLoader] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    if(emailModel) inputRefs.current[0].focus();
    else login.current.focus();
  }, [emailModel]);

  const handleLogin = async () => {
    setLoader(true);
    const result = await doLogin(username, password);
    if (result === "success") {
      navigateTo("/");
    } else {
      setErrorMessage(result);
      setLoader(false);
    }
  };

  const HandleRegister = async () => {
    setLoader(true);
    const result = await doRegister(username, password,email);
    if (result === "success") {
      setLoader(false);
      setEmailModel(true);
    } else {
      setLoader(false);
      setErrorMessage(result);
    }
  };

  const handleUsername = (event) => {
    setErrorMessage("");
    setUsername(event.target.value);
  };

  const handleEmailAddress = (event) => {
    setErrorMessage("");
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setErrorMessage("");
    setPassword(event.target.value);
  };

  const handleInputChange = (index, value) => {
    setEmailError("");
    if (!/^\d?$/.test(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    setEmailError("");
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (event) => {
    setEmailError("");
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  const handleEmailVerification = async ()=>{
    setLoader(true);
    let verificationCode = "";
    for(let a of otp) verificationCode += a;
    const result = await emailVerify(username,password,email,verificationCode);
    alert(result);
    if(result === "success")
    {
      setLoader(false);
      navigateTo("/");
    }
    else 
    {
      setLoader(false);
      setEmailError(result);
    }
  }

  return (
    <>
      <div className="login-page">
        {emailModel ? (
          <div ref={login} className="email-verify">
            <div className="email-verify-form">
              <div className="email-heading">
                An verification code is sent <br /> to {email}<br />(Also check spam folder)
                <button className='cross-email-verification' onClick={()=>setEmailModel(false)}>X</button>
              </div>
              <div className="email-input" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    maxLength={1}
                    value={digit}
                    type="text"
                    onChange={(event) => handleInputChange(index, event.target.value)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                  />
                ))}
              </div>
              <div className='error-message-while-login'>{emailError}</div>
              <div className='email-buttons'>
              <button onClick={handleEmailVerification} className="login-button">{loader ? <Loader height={"20px"}/> : "Varify Code"}</button>
              <button onClick={HandleRegister} className="login-button">Resend Code</button>
              </div>
              
            </div>
          </div>
        ) : (
          <div className="login">
            <div className="login-form">
              <div className="login-heading">{text}</div>
              <div className="login-method">
                <div className="login-inputs">
                  {text === "Login" ? null : (
                    <input
                      className="login-input"
                      onChange={handleEmailAddress}
                      placeholder="Email Address"
                      type="text"
                      value={email}
                    />
                  )}
                  <input
                    onChange={handleUsername}
                    className="login-input"
                    ref={login}
                    placeholder="Username"
                    type="text"
                    value={username}
                  />
                  <div className='password-conatiner'>
                  <input
                    onChange={handlePassword}
                    className="login-input"
                    placeholder="Password"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                  />
                  <span
                    className="password-visible"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <div>👁️</div> : <div>🙈</div>}
                  </span>
                  </div>  
                  <span className="error-message-while-login">{errorMessage}</span>
                  <button
                    onClick={text === "Login" ? handleLogin : HandleRegister}
                    className="login-button"
                  >
                    {loader ? <Loader /> : text}
                  </button>
                  <div className="faded-line"></div>
                </div>
                <div className="Login-using">
                  {text} using{" "}
                  <div className="other-login-methods">
                    <FcGoogle />
                    <FaGithub />
                  </div>
                </div>
                <div className="faded-line"></div>
              </div>
              <div className="new-user">
                {text === "Register" ? (
                  <div>
                    Have an account&nbsp;&nbsp;&nbsp;
                    <div onClick={() => navigateTo("/login", { state: { text: "Login" } })}
                      className="sign-up"
                    >
                      Login
                    </div>
                  </div>
                ) : (
                  <div>
                    Not have an account?
                    <div onClick={() => navigateTo("/login", { state: { text: "Register" } })}
                      className="sign-up"
                    >
                      Sign Up
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Login;
