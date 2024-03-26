import React, { useEffect } from "react";
import { useState } from "react";
import { getAllUsers, updateUser } from "../features/auth/authAPI";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../features/auth/authSlice";
import LoadingSpinner from "../features/loader/LoadingSpinner";

function ManageUsers() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState({});
  const [userData, setUserData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSetQuery = debounce(setQuery, 800);
  const loggedInUser = useSelector(selectLoggedInUser); // need to update userData in the session for new Projects

  const fetchdata = async (paginate, classification) => {
    try {
      const response = await getAllUsers(paginate, query, classification);
      const dta = response.data;
      const users = dta.filter(
        (user) =>
          Number(user.classification) < Number(loggedInUser.classification)
      );
      setUserData(users);
      setTotalUsers(response.totalItems);
      const data = loggedInUser.projects;
      setProjectData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let searchValue = e.target.value || "";
    const search = { _q: searchValue };
    debouncedSetQuery(search);
  };

  const handlePage = (e) => {
    setPage(e);
  };

  const changeUserDetail = (e) => {
    e.preventDefault();
    let userId = e.target.username.value;
    let classification = e.target.role.value;
    if (!userId || !classification) {
      setShowIncompleteModal(true);
      return;
    }
    let projects = [];
    let role;
    if (classification === "4") {
      role = "Admin";
    }
    if (classification === "3") {
      role = "Senior Manager";
    }
    if (classification === "2") {
      role = "Project Manager";
    }
    if (classification === "1") {
      role = "Team Member";
    }
    if (Number(classification) <= 2 && e.target.project.value) {
      projects = [e.target.project.value];
    } else if (Number(classification) <= 2 && e.target.project.value === "") {
      setShowErrorModal(true);
      return;
    } else {
      projectData.map((project) => projects.push(project.id));
    }
    const userData = {
      id: userId,
      classification: classification,
      role: role,
      projects: projects,
    };
    console.log(userData);
    const updateData = async (userData) => {
      const data = await updateUser(userData);
      if (data.message === "Success") {
        setShowSuccessModal(true);
        fetchdata();
      }
      return data;
    };
    updateData(userData);
  };

  useEffect(() => {
    const paginate = { _page: page, _limit: 7 };
    const val = Number(loggedInUser.classification);
    const classification = { _classification: val };
    fetchdata(paginate, classification);
  }, [page, query]);

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Failed to fetch users</div>;
  }
  let totalPages = Math.ceil(totalUsers / 7);
  return (
    <div className="flex flex-col md:flex-row lg:flex-row lg:py-16 py-72 min-w-96">
      <div className="lg:w-2/6 md:w-2/6 lg:pb-2 pb-20">
        <div className="card-container sm:m-5">
          <div className="card-heading flex flex-col min-h-16 ">
            <div className="">
              <h2 className="card-heading-text text-2xl ">Manage Users</h2>
            </div>
            <div className="pt-1">
              <p className="text-sm text-white">
                Change Roles of selected users
              </p>
            </div>
          </div>
          <div className=" bg-gray-400 grid border border-solid rounded-md pt-14 lg:mb-2 sm:mb-4">
            <form onSubmit={changeUserDetail}>
              <div className="px-2">
                <div>
                  <input
                    type="text"
                    name="search"
                    onChange={(e) => handleSearch(e)}
                    placeholder="Search..."
                    className="h-8 rounded-lg"
                  />
                </div>
                <div className="pt-4">
                  <select
                    size="7"
                    className="w-5/6 border px-2 rounded-lg "
                    name="username"
                  >
                    {userData.map((user, index) => (
                      <option
                        key={index}
                        value={`${user.id}`}
                        className="text-sm"
                        onClick={() => {
                          console.log(user.first_name);
                        }}
                      >
                        {`${user.first_name}  ${user.last_name}`}
                        {` - (${user.role})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="py-4 px-4">
                <select
                  name="role"
                  className="select select-bordered select-sm w-full max-w-xs py-0"
                >
                  <option value="" disabled selected>
                    Change Role
                  </option>
                  {Number(loggedInUser.classification) === 4 && (
                    <option value="4">Admin</option>
                  )}
                  {Number(loggedInUser.classification) >= 3 && (
                    <option value="3">Senior Manager</option>
                  )}
                  {Number(loggedInUser.classification) >= 2 && (
                    <option value="2">Project Manager</option>
                  )}
                  {Number(loggedInUser.classification) >= 1 && (
                    <option value="1">Team Member</option>
                  )}
                </select>
              </div>

              <div className="pb-4 px-4">
                <select
                  name="project"
                  className={`select select-bordered select-sm w-full max-w-xs py-0 `}
                >
                  <option value="" disabled selected>
                    Assign Project
                  </option>
                  {projectData.map((project, index) => {
                    return (
                      <option key={index} value={project.id}>
                        {project.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex justify-center lg:pb-4 md:pb-2 pb-2">
                <button className="btn btn-success btn-sm" type="Submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="lg:w-4/6 md:w-4/6">
        <div className="card-container sm:m-5 ">
          <div className="card-heading flex flex-col min-h-16 ">
            <div className="4">
              <h2 className="card-heading-text text-2xl lg:mx-10">
                Your Personnel
              </h2>
            </div>
            <div className="pt-1">
              <p className="text-sm text-white">
                All Users under you in Database
              </p>
            </div>
          </div>
          <div className=" bg-gray-400 grid grid-rows-2 border border-solid rounded-md pt-14">
            <div className="">
              <div className=" px-2">
                <div className={`grid `}>
                  <table className="min-w-full ">
                    <thead className="border-b-2 border-gray-600">
                      <tr>
                        <th className="pb-2">Full Name</th>
                        <th className="pb-2">Email</th>
                        <th className="pb-2">Project</th>
                        <th className="pb-2">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData != null ? (
                        userData.map((user, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-600 text-sm"
                          >
                            <td>{`${user.first_name} ${user.last_name}`}</td>
                            <td>{`${user.email}`}</td>
                            {Number(user.classification) >= 3 ? (
                              <td>ALL</td>
                            ) : (
                              <td>
                                {user.projects.map((project) => project.name)}
                              </td>
                            )}
                            <td>{`${user.role}`}</td>
                          </tr>
                        ))
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center ">
              <span className="ml-5 text-sm">
                Showing max. 7 entries / page
              </span>
              <div className="join mr-5">
                <button
                  className="join-item btn"
                  onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
                >
                  «
                </button>
                <button className="join-item btn">
                  Page {page} of {totalPages}
                </button>
                <button
                  className="join-item btn"
                  onClick={(e) =>
                    handlePage(page < totalPages ? page + 1 : page)
                  }
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        {/* ... Success modal ... */}
        {showSuccessModal && !showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-gray-200 p-6 rounded-md">
              <h2 className="text-2xl font-bold mb-4">Success!</h2>
              {Number(loggedInUser.classification) >= 3 ? (
                <p>
                  Note: Senior manager can not be assigned to single project.
                  <br></br> This role have access to all projects.{" "}
                </p>
              ) : (
                <p>Data successfully updated. </p>
              )}

              <Link to="/manageusers">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Back to Menu
                </button>
              </Link>
            </div>
          </div>
        )}
      </>
      <>
        {/* ... Error modal ... */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-gray-200 p-6 rounded-md">
              <h2 className="text-2xl font-bold mb-4">Error!</h2>
              <p>Kindly assign respective project</p>
              <Link to="/manageusers">
                <button
                  onClick={() => setShowErrorModal(false)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Back to Menu
                </button>
              </Link>
            </div>
          </div>
        )}
      </>
      <>
        {/* ... Incomplete Values modal ... */}
        {showIncompleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-gray-200 p-6 rounded-md">
              <h2 className="text-2xl font-bold mb-4">Error!</h2>
              <p>Insufficient Data !</p>
              <Link to="/manageusers">
                <button
                  onClick={() => setShowIncompleteModal(false)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Back to Menu
                </button>
              </Link>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default ManageUsers;
