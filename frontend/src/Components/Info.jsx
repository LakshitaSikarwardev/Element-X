import './../Css/Info.css';
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BsFillGiftFill } from "react-icons/bs";
import { IoLogoElectron } from "react-icons/io5";
import AnimatedCounter from './AnimatedCounter';
import useInViewport from './CustomHook';
import { useEffect, useRef,useState } from 'react';
const Info = ()=>{

    const [totalElement,setTotalElement] = useState(100);
    const [totalUser,setTotalUser] = useState(0);
    
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await fetch('https://elementx-7ure.onrender.com/getInfo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                setTotalElement(result.totalElement);
                setTotalUser(result.totalUser);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    },[]);


    const [ref,isVisible] = useInViewport();
    const isVisibleRef = useRef(isVisible);
    return(
        <div ref={ref} className="info">
            {
                isVisible && <div className='info-cantainer'>
                <div className='info-block'>
                    <div className='info-icon'><IoLogoElectron /></div>
                    <div className='info-number'><AnimatedCounter number={totalElement} duration={0.5}/></div>
                    <div className='info-detail'>User-contributed <br/>interface components
                    </div>
                </div>
                <div className='info-block'>
                <div className='info-icon'><BsFillGiftFill /></div>
                <div className='info-number'><AnimatedCounter number={100} duration={0.5}/>%</div>
                <div className='info-detail'>Completely free and <br/>usable anywhere!</div>
                </div>
                <div className='info-block'>
                <div className='info-icon'><HiOutlineUserGroup/></div>
                <div className='info-number'><AnimatedCounter number={totalUser} duration={0.5}/></div>
                <div className='info-detail'>Total users who trust and use our platform</div>
                </div>
                </div>
            }
        </div>
    )
}

export default Info;