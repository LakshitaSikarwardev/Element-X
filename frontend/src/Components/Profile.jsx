import { useState, useEffect, useContext } from 'react';
import './../Css/Profile.css';
import { useNavigate, useParams } from 'react-router-dom';
import BigProductCard from './BigProductCard';
import ProductCard from './ProductCard';
import { AuthContext } from '../Autherization';
import { CiEdit } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { RiUserFollowLine } from "react-icons/ri";
import Loader from './Loader';
import { FaLinkedin } from "react-icons/fa";
import ReactDOM from 'react-dom';
import { FaGithub } from "react-icons/fa6";
import { GiWorld } from "react-icons/gi";

const Profile = () => {
    const { user } = useParams();
    const navigateTo = useNavigate();
    const { username, logout, login, token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [userinfo, setUserinfo] = useState({
        username: "Username",
        posts: [],
        followers: [],
        following: [],
        image: null,
        _id : "",
    });
    const [isFollowing, setIsFollowing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const response = await fetch(`https://elementx-7ure.onrender.com/getUserInfo/${user}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const data = await response.json();
            setUserinfo(data);
            setIsFollowing(data.followers.includes(username));
        } else {
            console.log("Error while fetching user data");
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleFollow = async () => {
        try {
            if (!login) {
                navigateTo("/Login", { state: { text: "Login" } });
            }
            const response = await fetch("https://elementx-7ure.onrender.com/updateFollower", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ follower: username, username: user })
            });
            if (response.ok) {
                const data = await response.json();
                setUserinfo(data);
                setIsFollowing(!isFollowing);
            }
        } catch (e) {
            console.log("Error while fetching user data")
        }
    }


    return (
        <div className='profile-container'>
            <div className='profile-info-container'>
                <div className='profile-image-username'>
                    <div className='profile-image'>
                        {
                            userinfo.image ?
                                <img src={`https://elementx-7ure.onrender.com/getUserInfo/${userinfo._id}/image`} alt='profile-image' /> :
                                <div>{userinfo.username.substring(0, 1)}</div>
                        }
                    </div>
                    <div className='profile-username'>{userinfo.username}</div>
                </div>

                <div style={{ width: "70%" }}>
                    <div className='profile-info'>
                        <div>
                            <div className='profile-number'>{userinfo.posts.length}</div>
                            <div>Posts</div>
                        </div>
                        <div>
                            <div className='profile-number'>{userinfo.followers.length}</div>
                            <div>Followers</div>
                        </div>
                        <div>
                            <div className='profile-number'>{userinfo.following.length}</div>
                            <div>Following</div>
                        </div>
                    </div>

                    <div className='profile-bio'>{userinfo.bio ? userinfo.bio : "No bio available"}</div>
                    <div className='profile-other-info'>
                        {userinfo.linkedin && <a href={userinfo.linkedin} target='blank' className='linkedin-icon' style={{scale : "1"}}><FaLinkedin />LinkedIn</a>}
                        {userinfo.github && <a href={userinfo.github} target='blank' className='github-icon' style={{scale : "1"}}><FaGithub />Github</a>}
                        {userinfo.website && <a href={`https://${userinfo.website}`} target='blank' className='instagram-icon' style={{scale : "1"}}><GiWorld />Website</a>}
                    </div>
                    {
                        username == userinfo.username ?
                            <div className='profile-button'>
                                <button onClick={()=>navigateTo("/edit-profile")}><CiEdit />Edit Profile</button>
                                <button onClick={() => {
                                    logout()
                                    navigateTo("/");
                                    window.scrollTo(0, 0);
                                }}><IoIosLogOut />Logout</button>
                            </div>
                            : <div className='profile-button'>
                                {
                                    isFollowing ?
                                        <button onClick={handleFollow}><RiUserFollowLine />UnFollow</button>
                                        : <button onClick={handleFollow}><RiUserFollowLine />Follow</button>
                                }
                            </div>

                    }
                </div>
            </div>

            {
                loading && <div className='profile-loader'><div style={{ scale: "2" }}><Loader /></div></div>
            }
            <div className='profile-content'>
                {
                    userinfo.posts?.map((element) => (
                        !(element.category == "form" || element.category == "card") && <ProductCard style={{ flexGlow: "1" }}
                            html={element.html}
                            css={element.css}
                            show={false}
                            username={element.username}
                            likedPeople={element.likedPeople}
                            id={element._id}
                            background={element.background}
                        />
                    ))
                }
                {
                    userinfo.posts?.map((element) => (
                        (element.category == "form" || element.category == "card") &&
                        <BigProductCard style={{ flexGlow: "1" }}
                            html={element.html}
                            css={element.css}
                            show={false}
                            username={element.username}
                            likedPeople={element.likedPeople}
                            id={element._id}
                            background={element.background}
                        />
                    ))
                }
                {
                    !loading && userinfo.posts.length == 0 &&
                    <div style={{
                        width: "100vw",
                        scale: "0.8"
                    }}>
                        <div className="no-element-found">
                            <img src="./../public/end1.png" alt="Image" />
                            <div className="no-element-text">
                                <div >It Looks Like<br />{user === username ? "you haven’t uploaded any components yet." : "No Element post by user"}</div>
                                <button onClick={() => navigateTo("/create")}>Start Creating</button>
                            </div>
                        </div>
                    </div>
                }

            </div>
        </div>
    );
};

export default Profile;
