import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiLogOut, FiUser, FiMail, FiFolder } from "react-icons/fi";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "username",
    email: "",
  });
  const [repoCount, setRepoCount] = useState(0);
  const { setCurrentUser } = useAuth();

  // Get user initial for avatar
  const getUserInitial = (username) => {
    if (!username || username === "username") return "?";
    return username.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/user/userProfile/${userId}`
          );
          setUserDetails(response.data);

          // Fetch repository count
          try {
            const repoResponse = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/repo/user/${userId}`
            );
            setRepoCount(
              Array.isArray(repoResponse.data) ? repoResponse.data.length : 0
            );
          } catch (err) {
            console.error("Cannot fetch repositories: ", err);
          }
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />
      <UnderlineNav aria-label="Repository">
        <UnderlineNav.Item
          aria-current="page"
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: "white",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          onClick={() => navigate("/repo")}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      <motion.button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);
          window.location.href = "/auth";
        }}
        id="logout"
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <FiLogOut style={{ marginRight: "8px", verticalAlign: "middle" }} />
        Logout
      </motion.button>

      <motion.div
        className="profile-page-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="user-profile-section"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="profile-avatar"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {getUserInitial(userDetails.username)}
          </motion.div>

          <div className="name">
            <h3>{userDetails.username}</h3>
            {userDetails.email && (
              <p className="user-email">
                <FiMail
                  style={{ marginRight: "6px", verticalAlign: "middle" }}
                />
                {userDetails.email}
              </p>
            )}
          </div>

          <div className="user-stats">
            <div className="stat-item">
              <FiFolder className="stat-icon" />
              <div>
                <div className="stat-value">{repoCount}</div>
                <div className="stat-label">Repositories</div>
              </div>
            </div>
            <div className="stat-item">
              <FiUser className="stat-icon" />
              <div>
                <div className="stat-value">10</div>
                <div className="stat-label">Followers</div>
              </div>
            </div>
            <div className="stat-item">
              <FiUser className="stat-icon" />
              <div>
                <div className="stat-value">3</div>
                <div className="stat-label">Following</div>
              </div>
            </div>
          </div>

          <motion.button
            className="follow-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Edit Profile
          </motion.button>
        </motion.div>

        <motion.div
          className="heat-map-section"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <HeatMapProfile />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Profile;
