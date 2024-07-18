import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { IoMdSunny, IoMdMoon } from "react-icons/io";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  // Effect to initialize dark mode based on localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Function to toggle mobile menu
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-10 bg-red-500 py-2 text-white">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-4 md:justify-center md:px-16 lg:justify-between">
        <Link to={"/"}>
          <h1 className="text-3xl text-white">News App</h1>
        </Link>
        <button
          className="flex items-center justify-center rounded-full bg-white text-xl text-red-500 md:hidden"
          onClick={toggle}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ul
          className={`mt-2 w-full ${
            isOpen ? "" : "hidden"
          } flex flex-col flex-wrap items-center justify-center md:flex md:flex-row lg:mt-0 lg:w-auto`}
        >
          <li>
            <Link
              to="/"
              className={`block px-4 py-2 text-lg text-white hover:bg-red-400 ${
                location.pathname === "/" ? "bg-red-400" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li className="mb-4 md:mb-0">
            <Link
              to="/analytics"
              className={`block px-4 py-2 text-lg text-white hover:bg-red-400 ${
                location.pathname === "/analytics" ? "bg-red-400" : ""
              }`}
            >
              Analytics
            </Link>
          </li>
          <li className={location.pathname === "/analytics" ? "pl-4" : ""}>
            <button
              onClick={toggleDarkMode}
              className="rounded bg-red-400 px-4 py-[14px] text-white"
            >
              {darkMode ? <IoMdSunny /> : <IoMdMoon />}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
