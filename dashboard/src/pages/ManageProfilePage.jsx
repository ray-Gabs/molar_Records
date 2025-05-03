import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Avatar, Modal } from "@mui/material";
import ClientSidebar from "./UserFiling/ClientSidebar";
import "./ManageProfilePage.css";

const ManageProfilePage = () => {
  const userId = sessionStorage.getItem("userId");
  const role = sessionStorage.getItem("role");
  const [profile, setProfile] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);

  // Fetch user and profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found.");
          return;
        }

        // Fetch user data
        const userRes = await axios.get(`http://localhost:1337/auth/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails(userRes.data);

        // Fetch profile data based on role
        try {
          const profileRes = await axios.get(`http://localhost:1337/${role}/profile/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProfile(profileRes.data);
        } catch (profileErr) {
          if (profileErr.response?.status === 404) {
            setProfile(null);
          } else {
            console.error("Error fetching profile:", profileErr);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (userId && role) {
      fetchData();
    }
  }, [userId, role]);

  const getImageSrc = (image) => {
    if (!image) return "";
    return image.startsWith('data:image') ? image : `data:image/png;base64,${image}`;
  };

  return (
    <div className="ManageProfilePage">
      <ClientSidebar />
      <div className="profile-container">
        {/* Profile Info */}
        <div className="container">
          <h2>Manage Profile</h2>
          <label htmlFor="profile-pic" className="customFile">
            <Avatar
              alt="Profile Picture"
              src={getImageSrc(profile?.profileImages?.[0])}
              sx={{ width: 100, height: 100 }}
            />
          </label>
          <input
            type="file"
            id="profile-pic"
            name="profile-pic"
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
            onChange={(e) => setProfile((prev) => ({ ...prev, profilePicture: e.target.files[0] }))}
          />
          <TextField label="Name" fullWidth margin="dense" value={profile?.name || ""} disabled />
          <TextField
            label="Birthdate"
            type="date"
            fullWidth
            margin="dense"
            value={profile?.birthdate ? profile?.birthdate.split("T")[0] : ""}
            disabled
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Contact Number"
            type="number"
            fullWidth
            margin="dense"
            value={profile?.contactNumber || ""}
            disabled
          />
          <TextField label="Address" fullWidth margin="dense" value={profile?.address || ""} disabled />
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpenProfileModal(true)}>
            {profile ? "Edit Profile" : "Create Profile"}
          </Button>
        </div>

        {/* User Info */}
        <div className="container">
          <h2>Manage User Details</h2>
          <TextField label="Username" fullWidth margin="dense" value={userDetails.username || ""} disabled />
          <TextField label="Email" fullWidth margin="dense" value={userDetails.email || ""} disabled />
          <TextField label="Password" fullWidth margin="dense" value="********" type="password" disabled />
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpenUserModal(true)}>
            Edit User
          </Button>
        </div>
      </div>

      {/* Profile Modal */}
      <Modal open={openProfileModal} onClose={() => setOpenProfileModal(false)}>
        <Box className="modal-box">
          <Typography variant="h6">{profile ? "Edit Profile" : "Create Profile"}</Typography>
          <EditProfileForm
            profile={profile}
            setProfile={setProfile}
            userId={userId}
            role={role}
            onClose={() => setOpenProfileModal(false)}
          />
        </Box>
      </Modal>

      {/* User Modal */}
      <Modal open={openUserModal} onClose={() => setOpenUserModal(false)}>
        <Box className="modal-box">
          <Typography variant="h6">Edit User Details</Typography>
          <EditUserForm
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            userId={userId}
            onClose={() => setOpenUserModal(false)}
          />
        </Box>
      </Modal>
    </div>
  );
};

// Profile Form Component
const EditProfileForm = ({ profile, setProfile, userId, role, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    address: "",
    contactNumber: "",
    profilePicture: "",  // this will hold the base64 string
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        birthdate: profile.birthdate || "",
        address: profile.address || "",
        contactNumber: profile.contactNumber || "",
        profilePicture: profile.profileImages?.[0] || "",  // Safely access profileImages
      });
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePicture: reader.result })); // Handle base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      if (!/^\d+$/.test(formData.contactNumber)) {
        alert("Contact number must contain only digits.");
        return;
      }

      const endpoint = profile
        ? `http://localhost:1337/${role}/profile/${userId}`
        : `http://localhost:1337/${role}/create`;

      const base64Data = formData.profilePicture
        ? formData.profilePicture.replace(/^data:image\/(png|jpeg);base64,/, '')
        : null;

      const payload = {
        userId,
        name: formData.name,
        birthdate: formData.birthdate,
        address: formData.address,
        contactNumber: formData.contactNumber,
        profileImages: base64Data ? [base64Data] : [],
      };

      const response = await axios({
        method: profile ? "PUT" : "POST",
        url: endpoint,
        data: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (response.status === 200) {
        alert("Profile saved successfully!");
        setProfile(response.data); // This will now include the new base64 image
        onClose();
      }
    } catch (err) {
      if (err.response) {
        console.error('Backend error:', err.response.data);
        alert(`Error: ${err.response.data.message || 'An error occurred'}`);
      } else {
        console.error("Error:", err);
        alert('An unknown error occurred.');
      }
    }
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {formData.profilePicture && (
        <Avatar src={formData.profilePicture} sx={{ width: 100, height: 100, mt: 2 }} />
      )}
      <TextField
        label="Name"
        fullWidth
        margin="dense"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <TextField
        label="Birthdate"
        type="date"
        fullWidth
        margin="dense"
        value={formData.birthdate}
        onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Address"
        fullWidth
        margin="dense"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
      <TextField
        label="Contact Number"
        type="tel"
        fullWidth
        margin="dense"
        value={formData.contactNumber}
        onChange={(e) => {
          const value = e.target.value.replace(/[^\d]/g, "");
          setFormData({ ...formData, contactNumber: value });
        }}
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
        {profile ? "Save Changes" : "Create Profile"}
      </Button>
    </>
  );
};

// User Form Component
const EditUserForm = ({ userDetails, setUserDetails, userId, onClose }) => {
  const [formData, setFormData] = useState(userDetails);

  useEffect(() => {
    setFormData(userDetails);
  }, [userDetails]);

  const handleSave = async () => {
    try {
      const updatedData = {
        ...formData,
        password: formData.password ? formData.password : undefined,
      };

      const response = await axios.put(
        `http://localhost:1337/auth/user/edit`,
        {
          userId,
          ...updatedData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("User details updated successfully!");
        setUserDetails(response.data);  // Update user details state with the new data
        onClose();  // Close modal
      } else {
        console.error("Failed to update user details");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <TextField
        label="Username"
        fullWidth
        margin="dense"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <TextField
        label="Email"
        fullWidth
        margin="dense"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <TextField
        label="Password"
        fullWidth
        margin="dense"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
        Save Changes
      </Button>
    </>
  );
};

export default ManageProfilePage;
