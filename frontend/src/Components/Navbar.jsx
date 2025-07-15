import { useEffect, useState, useContext } from 'react';
import './../Css/Navbar.css';
import { MdKeyboardArrowDown, MdOutlineSmartButton, MdMenu, MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Model from './Model';
import ReactDOM from "react-dom";
import { AuthContext } from '../Autherization';
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  const [model, setModel] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigateTo = useNavigate();
  const { login, logout, user, username } = useContext(AuthContext);

  const handleCreateRequest = () => {
    login ? setModel(!model) : navigateTo('/login', { state: { text: "Login" } });
    window.scrollTo(0, document.body.scrollHeight);
  }


  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [navigateTo]);


  return (
    <>
      <div> 
        {ReactDOM.createPortal(model ? <Model setModel={setModel} model={model} /> : null, document.body)}
      </div>
      <div className='navbar'>
        <div className='navbar-right'>
          <div className='logo' onClick={() => navigateTo('/')}>ElementX</div>
          <button className="navbar-button desktop-only" id='element-button' onClick={() => navigateTo('/elements')}>
            Elements&nbsp;<MdKeyboardArrowDown />
          </button>
        </div>
        
        <div className='navbar-left desktop-only'>
          <button className="navbar-button navbar-create" onClick={handleCreateRequest}><span style={{fontSize : "1.5em"}}>+</span> Create</button>    
          {login ? (
            <>
              {user == "admin" && <button className="navbar-button navbar-login" onClick={() => navigateTo('/review')}>Review</button>}
              <button className="navbar-button navbar-signup" onClick={() => navigateTo(`/profile/${username}`)}><FaUser />Profile</button>
            </>
          ) : (
            <>
              <button className="navbar-button navbar-login" onClick={() => navigateTo('/login', { state: { text: "Login" } })}>Log in</button>
              <button className="navbar-button navbar-signup" onClick={() => navigateTo('/login', { state: { text: "Register" } })}>Sign up</button> 
            </>
          )}
        </div>
        
        <div className='mobile-menu-button mobile-only' onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </div>
        
        <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className='mobile-menu-content'>
            <button className="mobile-nav-button" onClick={() => { navigateTo('/elements'); setIsMobileMenuOpen(false); }}>
              Elements
            </button>
            <button className="mobile-nav-button" onClick={() => { handleCreateRequest(); setIsMobileMenuOpen(false); }}>
              Create
            </button>
            {login ? (
              <>
                {user == "admin" && (
                  <button className="mobile-nav-button" onClick={() => { navigateTo('/review'); setIsMobileMenuOpen(false); }}>
                    Review
                  </button>
                )}
                <button className="mobile-nav-button" onClick={() => { navigateTo(`/profile/${username}`); setIsMobileMenuOpen(false); }}>
                  Profile
                </button>
                <button className="mobile-nav-button" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button className="mobile-nav-button" onClick={() => { navigateTo('/login', { state: { text: "Login" } }); setIsMobileMenuOpen(false); }}>
                  Log in
                </button>
                <button className="mobile-nav-button" onClick={() => { navigateTo('/login', { state: { text: "Register" } }); setIsMobileMenuOpen(false); }}>
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar;