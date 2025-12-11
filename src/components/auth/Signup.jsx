import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiUserPlus } from "react-icons/fi";
import { PageHeader } from "@primer/react";
import { Button } from "@primer/react";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth(); // you forgot this earlier

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
        {
          email,
          password,
          username,
        }
      );

      const token = res.data.token;
      const userId = res.data.userId;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      setCurrentUser(userId);

      setLoading(false);
      window.location.href = "/app";
    } catch (err) {
      console.error(err);
      alert("Signup Failed");
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="login-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="login-logo-container"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.img
          className="logo-login"
          src={logo}
          alt="InfernoForge Logo"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>

      <motion.div
        className="login-box-wrapper"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div
          className="login-heading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div style={{ padding: "8px" }}>
            <PageHeader>
              <PageHeader.TitleArea variant="large">
                <PageHeader.Title
                  style={{
                    color: "var(--text-secondary)",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Sign Up
                </PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </div>
        </motion.div>

        <motion.div
          className="login-box"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="label">
              <FiUser style={{ marginRight: "8px", verticalAlign: "middle" }} />
              Username
            </label>
            <input
              autoComplete="off"
              name="Username"
              id="Username"
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label className="label">
              <FiMail style={{ marginRight: "8px", verticalAlign: "middle" }} />
              Email address
            </label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <label className="label">
              <FiLock style={{ marginRight: "8px", verticalAlign: "middle" }} />
              Password
            </label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{ width: "100%" }}
          >
            <Button
              variant="primary"
              className="login-btn"
              disabled={loading}
              onClick={handleSignup}
            >
              <FiUserPlus
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              {loading ? "Loading..." : "Sign Up"}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="pass-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <p>
            Already have an account? <Link to="/auth">Login</Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
