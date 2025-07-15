import './../Css/Footer.css';
import { IoLogoInstagram, IoLogoFacebook,IoLogoYoutube,IoLogoGithub,IoLogoLinkedin } from "react-icons/io5";
import { MdAlternateEmail } from "react-icons/md";

const Footer = ()=>{

    return(
        <>
            <div className="footer">
                
                <div className='logo'>
                    ElementX
                    <div className='about-logo'>
                        "Powered by Elementx: Your source for ready-made HTML and CSS code snippets for stunning UI elements."     
                    </div>
                    <div className='copyright'>
                    © 2024 Elementx. All rights reserved.
                </div>
                </div>
                <div className='services-container'>
                <div className="service-heading">Our Plateform Provide
                    <div className='services'>
                        <div>Cards</div>
                        <div>Forms</div>
                        <div>Buttons</div>
                        <div>Loaders</div>
                        <div>Check Boxes</div>
                        <div>Toggle Switches</div>
                        <div>Radio Buttons</div>
                    </div>
                </div>

                <div className='contact-container'>

                <div className='contact'>
                    <div className='contact-us-heading'>Contact Us
                    <div className="contact-us">
                        <IoLogoInstagram className='instagram-icon'/>
                        <IoLogoFacebook className='facebook-icon'/>
                        <IoLogoYoutube className='youtube-icon'/>
                        <IoLogoGithub className='github-icon'/>
                        <IoLogoLinkedin className='linkedin-icon'/>
                    </div>
                    </div>
                    <div className='contact-email'>
                            <MdAlternateEmail />elementx.dev01gmail.com
                    </div>
                </div>

                </div>
                </div>
            </div>
        </>
    )

}

export default Footer;