import { createContext,useEffect,useState } from "react";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [username,setUsername] = useState(null);
    const [token,setToken] = useState(null);
    const [login,setLogin] = useState(false);
    const [user,setUser] = useState("user");
    
    useEffect(()=>{
        const existingUser = localStorage.getItem('username');
        const existingToken = localStorage.getItem('token');

        const verifyToken = async ()=>{
            const response = await fetch("https://elementx-7ure.onrender.com/verifyToken",{
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${existingToken}`
                }
            });
    
            if(response.ok){
                
                const data = await response.json();
                setUser(data.role);
                setUsername(existingUser);
                setToken(existingToken);
                setLogin(true);
            }
            else {
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                setLogin(false);
            }
        }
        
        if(existingUser && existingToken) {
            verifyToken(); 
        }
    },[]);

    const doLogin = async (username,password)=>{
        try{
            
            const response = await fetch("https://elementx-7ure.onrender.com/login",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ username, password})
            });
    
            if(response.ok)
            {
                const data = await response.json();
                setUser(data.role);
                setUsername(data.username);
                setToken(data.token);
                setLogin(true);
                localStorage.setItem('username',data.username);
                localStorage.setItem('token',data.token);
                return "success"
            }
            else 
            {
                switch(response.status)
                {
                    case 401 : return "*Invalid Password"
                    case 404 : return "*Invalid username"
                    default : return "Something went wrong"
                }
            }
        }catch(e)
        {
            return "Something went wrong"
        }
        
    } 

    const emailVerify = async (username,password,email,verificationCode)=>{
        try{
            const response = await fetch("https://elementx-7ure.onrender.com/emailVerify",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({username,password,email,verificationCode})
            });
    
            if(response.ok)
            {
                const data = await response.json();
                setUsername(data.username);
                setToken(data.token);
                setLogin(true);
                localStorage.setItem("username",data.username);
                localStorage.setItem("token",data.token);
                return "success"
            }
            else {
                return "*Invalid Code"
            }
        }catch(e)
        {
            return "*Server Error";
        }

    }

    const doRegister = async (username,password,email)=>{
        try{
            const response = await fetch("https://elementx-7ure.onrender.com/register",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({username,password,email})
            });
    
            const data = await response.json();
            return data.message;

        }catch(e)
        {
            return "Something Went Wrong"
        }
        
    }

    const logout = ()=>{
        try{
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            setUsername(null);
            setToken(null);
            setLogin(false);
            return true;
        }catch(e)
        {
            return false;
        }
    };


    return(
        <AuthContext.Provider value={{username,token,doLogin,logout,login,doRegister,emailVerify,user}}>
            {children}
        </AuthContext.Provider>
    )
};