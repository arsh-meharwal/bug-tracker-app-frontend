import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { selectLoggedInUser } from "../auth/authSlice";

const CustomNavbar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const loggedInUser = useSelector(selectLoggedInUser);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <div className="vertical-navbar">
        <nav>
          <div className="flex flex-col">
            <div
              className="relative flex justify-center align-center top-0 mb-20"
              style={{}}
            >
              <span class="h-24 w-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                <img
                  src="/Logo1.png"
                  alt="Your Image"
                  class="h-full w-full object-cover"
                />
              </span>
            </div>
            <div className="pb-16">
              {Number(loggedInUser.classification) === 1 && (
                <ul id="menu">
                  <Link to="/">
                    <li
                      className={
                        location.pathname === "/" ? "active" : "non-active"
                      }
                    >
                      <div className="flex justify-center align-center gap-2">
                        <span data-hover="Tickets">Tickets</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-notepad-text"
                        >
                          <path d="M8 2v4" />
                          <path d="M12 2v4" />
                          <path d="M16 2v4" />
                          <rect width="16" height="18" x="4" y="4" rx="2" />
                          <path d="M8 10h6" />
                          <path d="M8 14h8" />
                          <path d="M8 18h5" />
                        </svg>
                      </div>
                    </li>
                  </Link>
                </ul>
              )}
              {Number(loggedInUser.classification) === 2 && (
                <ul id="menu">
                  <Link to="/dashboard" activeClassName="active">
                    <li
                      className={
                        location.pathname === "/dashboard"
                          ? "active"
                          : "non-active"
                      }
                    >
                      <div className="flex justify-center align-center  gap-2">
                        <span data-hover="Dashboard">Dashboard</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-bar-chart-4"
                        >
                          <path d="M3 3v18h18" />
                          <path d="M13 17V9" />
                          <path d="M18 17V5" />
                          <path d="M8 17v-3" />
                        </svg>
                      </div>
                    </li>
                  </Link>
                  <Link to="/">
                    <li
                      className={
                        location.pathname === "/" ? "active" : "non-active"
                      }
                    >
                      <div className="flex justify-center align-center gap-2">
                        <span data-hover="Tickets">Tickets</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-notepad-text"
                        >
                          <path d="M8 2v4" />
                          <path d="M12 2v4" />
                          <path d="M16 2v4" />
                          <rect width="16" height="18" x="4" y="4" rx="2" />
                          <path d="M8 10h6" />
                          <path d="M8 14h8" />
                          <path d="M8 18h5" />
                        </svg>
                      </div>
                    </li>
                  </Link>
                  <Link to="/manageusers">
                    <li
                      className={
                        location.pathname === "/manageusers"
                          ? "active"
                          : "non-active"
                      }
                    >
                      <div className="flex justify-center align-center gap-2">
                        <span data-hover="Projects"> Members </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-users"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                    </li>
                  </Link>
                </ul>
              )}
              {Number(loggedInUser.classification) > 2 && (
                <ul id="menu">
                  <Link to="/dashboard" activeClassName="active">
                    <li
                      className={
                        location.pathname === "/dashboard"
                          ? "active"
                          : "non-active"
                      }
                    >
                      <div className="flex justify-center align-center  gap-2">
                        <span data-hover="Dashboard">Dashboard</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-bar-chart-4"
                        >
                          <path d="M3 3v18h18" />
                          <path d="M13 17V9" />
                          <path d="M18 17V5" />
                          <path d="M8 17v-3" />
                        </svg>
                      </div>
                    </li>
                  </Link>
                  <Link to="/">
                    <li
                      className={
                        location.pathname === "/" ? "active" : "non-active"
                      }
                    >
                      <div className="flex justify-center align-center gap-2">
                        <span data-hover="Tickets">Tickets</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-notepad-text"
                        >
                          <path d="M8 2v4" />
                          <path d="M12 2v4" />
                          <path d="M16 2v4" />
                          <rect width="16" height="18" x="4" y="4" rx="2" />
                          <path d="M8 10h6" />
                          <path d="M8 14h8" />
                          <path d="M8 18h5" />
                        </svg>
                      </div>
                    </li>
                  </Link>
                  <Link to="/projects">
                    <li
                      className={
                        location.pathname === "/projects"
                          ? "active"
                          : "non-active"
                      }
                    >
                      <div className="flex justify-center align-center gap-2">
                        <span data-hover="Projects">Projects </span>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-building-2"
                        >
                          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                          <path d="M10 6h4" />
                          <path d="M10 10h4" />
                          <path d="M10 14h4" />
                          <path d="M10 18h4" />
                        </svg>
                      </div>
                    </li>
                  </Link>
                  <Link to="/manageusers">
                    <li
                      className={
                        location.pathname === "/manageusers"
                          ? "active"
                          : "non-active"
                      }
                    >
                      <div className="flex justify-center align-center gap-2">
                        <span data-hover="Projects"> Members </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.25"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-users"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                    </li>
                  </Link>
                </ul>
              )}
            </div>
          </div>
        </nav>
      </div>
      <div className="horizontal-navbar z-3 w-full h-12 lg:h-11">
        <div className="hamburger-container">
          <input type="checkbox" id="toggle" />
          <label className="hamburger" for="toggle">
            <span></span>
            <span></span>
            <span></span>
          </label>

          {Number(loggedInUser.classification) === 1 && (
            <ul className="nav-menu">
              <Link to="/">
                <li>
                  <span className=" text-white">Tickets</span>
                </li>
              </Link>
            </ul>
          )}
          {/* Project Manager */}
          {Number(loggedInUser.classification) === 2 && (
            <ul className="nav-menu">
              <Link to="/dashboard">
                <li>
                  <span className=" text-white">Dashboard</span>
                </li>
              </Link>
              <Link to="/">
                <li>
                  <span className=" text-white">Tickets</span>
                </li>
              </Link>

              <Link to="/manageusers">
                <li>
                  <span className=" text-white">Members</span>
                </li>
              </Link>
            </ul>
          )}
          {Number(loggedInUser.classification) > 2 && (
            <ul className="nav-menu">
              <Link to="/dashboard">
                <li>
                  <span className=" text-white">Dashboard</span>
                </li>
              </Link>
              <Link to="/">
                <li>
                  <span className=" text-white">Tickets</span>
                </li>
              </Link>
              <Link to="/projects">
                <li>
                  <span className=" text-white">Projects</span>
                </li>
              </Link>
              <Link to="/manageusers">
                <li>
                  <span className=" text-white">Members</span>
                </li>
              </Link>
            </ul>
          )}
        </div>
        <div className="flex px-10 items-center font-sans lg:py-2">
          <span className="font-base text-white text-xl">{`Welcome: ${loggedInUser.first_name} ${loggedInUser.last_name}`}</span>
        </div>
      </div>
      <div className="content bg-gray-600 mt-6 lg:mt-0">{children}</div>
    </div>
  );
};

export default CustomNavbar;
