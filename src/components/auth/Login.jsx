import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { PageHeader, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/app";
    } catch (err) {
      console.error(err);
      alert("Login Failed!");
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
                  Sign In
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
            transition={{ delay: 0.7 }}
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
              placeholder="Enter your password"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ width: "100%" }}
          >
            <Button
              variant="primary"
              className="login-btn"
              disabled={loading}
              onClick={handleLogin}
            >
              <FiLogIn
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="pass-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p>
            New to InfernoForge? <Link to="/signup">Create an account</Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
