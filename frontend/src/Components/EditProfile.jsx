import { CiLinkedin, CiLocationOn } from "react-icons/ci";
import { GiWorld } from "react-icons/gi";
import { FaUser, FaGithub, FaBuilding } from "react-icons/fa";
import { CiSaveUp2 } from "react-icons/ci";
import { AuthContext } from "../Autherization";
import { useContext, useEffect, useState } from "react";
import "./../Css/EditProfile.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const EditProfile = () => {
  const { username: user, token } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();

  const [userInfo, setUserInfo] = useState({
    _id: "",
    username: "",
    bio: "",
    linkedin: "",
    github: "",
    website: "",
    location: "",
    company: "",
    image: null, 
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:4040/getUserInfo/${user}`, {
        headers: { "Content-Type": "application/json", Authorization: token },
      });
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
        console.log(data);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, token]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const formData = new FormData();
    Object.entries(userInfo).forEach(([key, val]) => {
      if (key !== "image" && val != null) {
        formData.append(key, val);
      }
    });
    if (image) {
      formData.append("image", image);
    }

    const res = await fetch(
      `http://localhost:4040/editProfile/${userInfo._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    );

    if (res.ok) {
      navigateTo("/profile/"+user)
    } else {
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="edit-profile-loader">
        <Loader style={{ scale: 2 }} />
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-heading">Edit Profile</h2>

      <div className="edit-profile-content">
        <div className="edit-profile-images">
          <div className="profile-image">
            {userInfo.image ? (
              <img
                    src={`https://elementx-7ure.onrender.com/${userInfo._id}/image`}
                    alt="profile"
                    />
            ) : (
              <div>{userInfo.username.charAt(0)}</div>
            )}
          </div>

          <label htmlFor="file-upload" className="custom-file-upload">
            <CiSaveUp2 size="1.5em" /> {image ? "One file selected" : "Upload File"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="edit-profile-info">
          <div className="edit-profile-block">
            <label>
              <FaUser /> Username
            </label>
            <input
              name="username"
              value={userInfo.username}
              onChange={handleChange}
            />
          </div>

          <div className="edit-profile-block">
            <label>Bio (optional)</label>
            <input
              name="bio"
              value={userInfo.bio || ""}
              onChange={handleChange}
            />
          </div>

          <div className="edit-profile-block">
            <label>
              <CiLinkedin /> LinkedIn (optional)
            </label>
            <input
              name="linkedin"
              value={userInfo.linkedin}
              onChange={handleChange}
            />
          </div>

          <div className="edit-profile-block">
            <label>
              <FaGithub /> GitHub (optional)
            </label>
            <input
              name="github"
              value={userInfo.github}
              onChange={handleChange}
            />
          </div>

          <div className="edit-profile-block">
            <label>
              <GiWorld /> Website (optional)
            </label>
            <input
              name="website"
              value={userInfo.website}
              onChange={handleChange}
            />
          </div>

          <div className="edit-profile-block">
            <label>
              <CiLocationOn /> Location (optional)
            </label>
            <input
              name="location"
              value={userInfo.location}
              onChange={handleChange}
            />
          </div>

          <div className="edit-profile-block">
            <label>
              <FaBuilding /> Company (optional)
            </label>
            <input
              name="company"
              value={userInfo.company}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="edit-profile-bottom">
        <button onClick={()=>navigateTo(-1)}>Cencel</button>
        <button onClick={handleSave}>Save changes</button>
      </div>
    </div>
  );
};

export default EditProfile;
