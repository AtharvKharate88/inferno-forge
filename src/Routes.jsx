import React from "react";
import { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

//pages
import Dashboard from "./components/dashboard/Dashboard";
import Landing from "./components/Landing";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { useAuth } from "./authContext";
const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }
    // Public landing page at '/'
    // If not logged in, send to /auth unless already on auth/signup/landing
    if (
      !userIdFromStorage &&
      !["/auth", "/signup", "/"].includes(window.location.pathname)
    ) {
      navigate("/auth");
    }
    // If logged in and currently on auth/signup or landing, navigate to app dashboard
    if (
      userIdFromStorage &&
      ["/auth", "/signup", "/"].includes(window.location.pathname)
    ) {
      navigate("/app");
    }
  }, [currentUser, navigate, setCurrentUser]);
  let element = useRoutes([
    {
      path: "/",
      element: <Landing />,
    },
    {
      path: "/app",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ]);
  return element;
};
export default ProjectRoutes;
