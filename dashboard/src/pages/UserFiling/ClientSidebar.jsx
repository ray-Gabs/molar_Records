import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './ClientSidebar.css';

function ClientSidebar() {
  const navigate = useNavigate();

  // Placeholder state for user data
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    // Simulate fetching the profile image URL from DB or API
    // Replace this with your real fetch logic
    const fetchUserData = async () => {
      const fakeUser = {
        profileImageUrl: "https://i.pravatar.cc/150?img=32", // placeholder image
      };
      setProfileImageUrl(fakeUser.profileImageUrl);
    };

    fetchUserData();
  }, []);

  return (
    <aside className="ClientSidebar">
      <nav className="SidebarNav">
        <div className="ClientContainer">
          <div className="ClientProfile" onClick={() => navigate("/Profile")}>
            <div className="ProfileImageWrapper">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="ProfileImage" />
              ) : (
                <div className="ProfileImagePlaceholder" />
              )}
            </div>
          </div>
          <div className="ClientTab" onClick={() => navigate("/")}>
            <span>Home</span>
          </div>
        </div>
        
        <div className="ClientLogout" onClick={() => navigate("/Login")}>
          <hr />
          <span>Logout</span>
        </div>
      </nav>
    </aside>
  );
}

export default ClientSidebar;
