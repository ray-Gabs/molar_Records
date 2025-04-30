import React, { useState } from 'react';
import { Button, TextField, InputAdornment, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageProfilePage() {
  const [profileData, setProfileData] = useState({
    name: '',
    birthdate: '',
    address: '',
    contactNumber: '',
    profileImage: '', // Will store the base64 image
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUploading(true); // Set uploading state to true
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profileImage: reader.result }); // Store base64 image
        setImagePreview(URL.createObjectURL(file)); // Preview image
        setImageUploading(false); // Set uploading state to false after processing
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const userId = sessionStorage.getItem("userId"); // ✅ get from session
    const { name, birthdate, address, contactNumber, profileImage } = profileData;
  
    if (!userId) {
      setErrorMessage("User ID not found. Please sign up or log in again.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:1337/profile/createProfile", {
        userId,
        name,
        birthdate,
        address,
        contactNumber,
        profileImage,
      });
  
      if (response.data.success) {
        navigate("/");
      } else {
        setErrorMessage("Profile creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Profile creation error:", error);
      setErrorMessage("An error occurred while creating your profile. Please try again later.");
    }
  };

  return (
    <div className="ProfilePage">
      <h2>Create Profile</h2>
      <div className="ProfileContent">
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Show error message */}

        {/* Image Upload Section */}
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleImageChange}
        />
        {imageUploading ? (
          <CircularProgress />
        ) : (
          imagePreview && <img src={imagePreview} alt="Image Preview" style={{ maxWidth: "100px" }} />
        )}

        {/* Profile Info Section */}
        <TextField
          label="Full Name"
          variant="filled"
          fullWidth
          value={profileData.name}
          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
        />
        <TextField
          label="Birthdate"
          variant="filled"
          type="date"
          fullWidth
          value={profileData.birthdate}
          onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Address"
          variant="filled"
          fullWidth
          value={profileData.address}
          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
        />
        <TextField
          label="Contact Number"
          variant="filled"
          fullWidth
          value={profileData.contactNumber}
          onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })}
          InputProps={{ startAdornment: <InputAdornment position="start">+1</InputAdornment> }}
        />
        
        <Button variant="contained" onClick={handleSubmit} disabled={imageUploading}>Create Profile</Button>
      </div>
    </div>
  );
}

export default ManageProfilePage;
