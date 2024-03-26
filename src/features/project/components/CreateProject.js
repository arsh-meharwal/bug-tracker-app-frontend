import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { selectLoggedInUser } from "../../auth/authSlice";
import { getAllUsers } from "../../auth/authAPI";
import { createProject } from "../projectAPI";

export default function CreateProject() {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState();
  const [submitError, setSubmitError] = useState(false);
  const loggedInUser = useSelector(selectLoggedInUser);

  function getIndianDate() {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    };
    const indianDateTime = new Date().toLocaleString("en-IN", options);
    return indianDateTime;
  }

  const userName = `${loggedInUser.first_name} ${loggedInUser.last_name}`;
  const userMail = loggedInUser.email;
  const userId = loggedInUser.id;
  const userClass = loggedInUser.classification;
  const time = getIndianDate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.description.value || !e.target.heading.value) {
      setError(true);
      return; // Prevent dispatch if title or description is empty
    }
    setError(false);

    const data = {
      name: e.target.heading.value,
      description: e.target.description.value,
      initiator: userName,
      created: time,
      tickets: [],
    };
    const submitData = async (data) => {
      setLoading(true);
      let res = await createProject(data);
      let response = res.data.status;
      if (response === "Success") {
        setLoading(false);
        setShowSuccessModal(true);
      } else {
        setLoading(false);
        setSubmitError(true);
      }
    };
    submitData(data);
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div className="bg-gray-400">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="lg:mx-20 lg:py-10 px-4 py-4"
      >
        <div className="py-6">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className=" font-semibold leading-7 text-gray-900 text-2xl">
              New Project
            </h2>
            <p className="mt-1 text-base leading-6 text-gray-600">
              Create a new work project
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-1">
                {/* Initiator Name here */}
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Created By
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="userName"
                    id="name"
                    placeholder={userName}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Creation Date
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="userName"
                    id="name"
                    placeholder={time}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Project Title
                </label>
                <div className="mt-2">
                  <textarea
                    id="heading"
                    rows={1}
                    cols={1}
                    name="heading"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {error && (
                    <p className="font-medium text-red-500 text-sm pt-2">
                      *Check for empty values
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="text"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    type="text"
                    className="block w-full min-h-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {error && (
                    <p className="font-medium text-red-500 text-sm pt-2">
                      *Check for empty values
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link to="/projects">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
      <>
        {/* ... Success modal ... */}
        {showSuccessModal && !submitError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md">
              <h2 className="text-2xl font-bold mb-4">Success!</h2>
              <p>Project has been successfully created. </p>
              <Link to="/projects">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Back to Menu
                </button>
              </Link>
            </div>
          </div>
        )}
        {/* ... Error  modal ... */}
        {!showSuccessModal && submitError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md">
              <h2 className="text-2xl font-bold mb-4">Submit Error!</h2>
              <p>Unable to submit data. Kindly Try Later</p>
              <Link to="/projects">
                <button
                  onClick={() => {
                    setSubmitError(false);
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Back to Menu
                </button>
              </Link>
            </div>
          </div>
        )}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md">
              <button className="btn btn-square">
                <span className="loading loading-spinner"></span>
              </button>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
