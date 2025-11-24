import React from "react";
import { Link } from "react-router-dom";
import "./Topbar.css";
import { FaSearch } from "react-icons/fa";
import ProfileMenu from "../ProfileMenu/ProfileMenu";

const Topbar = () => {
  return (
    <header className="topbar">
      {/* Lado esquerdo com logo e links */}
      <div className="topbar-left">
        <h1 className="logo">Tracker</h1>

        <nav className="nav-links">
          <Link to="/SeriesPage" className="nav-link">
            Séries
          </Link>
          <Link to="/mylist" className="nav-link">
            My List
          </Link>
        </nav>
      </div>

      {/* Lado direito com busca e menu do perfil */}
      <div className="topbar-right">
        <Link to="/search" className="icon-link">
          <FaSearch className="icon search-icon" />
        </Link>

        <ProfileMenu />
      </div>
    </header>
  );
};

export default Topbar;
