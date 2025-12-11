import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiUser } from "react-icons/fi";
import "./navbar.css";
import logo from "../assets/github-mark-white.svg";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link to="/">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <motion.img
            src={logo}
            alt="InfernoForge Logo"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          />
          <h3>InfernoForge</h3>
        </motion.div>
      </Link>
      <div>
        <Link to="/create">
          <motion.p
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Create Repository
          </motion.p>
        </Link>
        <Link to="/profile">
          <motion.p
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiUser style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Profile
          </motion.p>
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
