import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Topbar.css";
import { FaSearch } from "react-icons/fa";
import ProfileMenu from "../ProfileMenu/ProfileMenu";

const Topbar = () => {
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic"));

  useEffect(() => {
    const updatePic = () => {
      setProfilePic(localStorage.getItem("profilePic"));
    };

    // Evento customizado disparado pelo ProfilePage
    window.addEventListener("profilePicUpdated", updatePic);

    return () => {
      window.removeEventListener("profilePicUpdated", updatePic);
    };
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="logo">Tracker</h1>

        <nav className="nav-links">
          <Link to="/SeriesPage" className="nav-link">Séries</Link>
          <Link to="/mylist" className="nav-link">My List</Link>
        </nav>
      </div>

      <div className="topbar-right">
        <Link to="/search" className="icon-link">
          <FaSearch className="icon search-icon" />
        </Link>

        <ProfileMenu profilePic={profilePic} />
      </div>
    </header>
  );
};

export default Topbar;