import { useSelector, useDispatch } from "react-redux";
import { createTicketAsync } from "../createTicketSlice";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { selectLoggedInUser } from "../../auth/authSlice";
import { getAllUsers } from "../../auth/authAPI";
import { getProjects } from "../../project/projectAPI";
import LoadingSpinner from "../../loader/LoadingSpinner";
import FullScreenLoader from "../../loader/FullScreenLoader";

export default function CreateTicket() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState(false);
  function getIndianDate() {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
    };
    const indianDateTime = new Date().toLocaleString("en-IN", options);
    return indianDateTime;
  }
  function getIndianTime() {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
      timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
    };
    const indianDateTime = new Date().toLocaleString("en-IN", options);
    return indianDateTime;
  }
  let d = new Date();
  let ms = d.getMilliseconds().toString().padStart(3, "0");
  let year = d.getFullYear().toString().slice(2);
  let month = d.getMonth().toString().padStart(2, "0");
  let mnth = d.getMonth().toString();
  let day = d.getDate().toString().padStart(2, "0");
  let hour = d.getHours().toString().padStart(2, "0");
  let hr = d.toLocaleTimeString();
  let minutes = d.getMinutes().toString().padStart(2, "0");
  let seconds = d.getSeconds().toString().padStart(2, "0");

  const TtNum = year + month + day + hour + minutes + seconds + ms;

  const loggedInUser = useSelector(selectLoggedInUser);
  // const projects = loggedInUser.projects;

  const fetchData = async () => {
    try {
      const allUsers = await getAllUsers();
      if (Number(loggedInUser.classification) >= 3) {
        try {
          const project = await getProjects();
          console.log(project);
          setProjects(project.data);
        } catch (err) {
          const error = `Error Fetching Projects: ${err}`;
          setErr(error);
        }
      } else {
        setProjects(loggedInUser.projects);
      }
      const users = allUsers.data.filter(
        (user) =>
          Number(user.classification) + 1 ===
            Number(loggedInUser.classification) ||
          Number(user.classification) === Number(loggedInUser.classification)
      );
      console.log(users);
      setUsers(users);
    } catch (error) {
      setErr(error);
    } finally {
      setLoading(false);
    }
  };

  const userName = `${loggedInUser.first_name} ${loggedInUser.last_name}`;
  const userMail = loggedInUser.email;
  const userId = loggedInUser.id;
  const userClass = loggedInUser.classification;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !e.target.description.value ||
      !e.target.heading.value ||
      !e.target.project.value
    ) {
      setError(true);
      return; // Prevent dispatch if title or description is empty
    }
    setError(false);
    const result = projects.filter(
      (project) => project.name === e.target.project.value
    );
    const projectId = result.map((project) => project.id);
    const time = getIndianTime();
    const date = getIndianDate();
    dispatch(
      createTicketAsync({
        number: TtNum,
        initiator: userName,
        initiator_id: userId,
        initiator_mail: userMail,
        initiator_classification: userClass,
        project: projectId,
        project_name: e.target.project.value,
        title: e.target.heading.value,
        description: e.target.description.value,
        status: "Assigned",
        priority: e.target.priority.value,
        created_at: date,
        created_time: time,
        updated_at: null,
        assigned_to: e.target.assignee.value,
        comments: [],
      })
    );
    setShowSuccessModal(true);
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <FullScreenLoader />
      </div>
    );
  }

  if (err) {
    return <div>Error: {err}</div>;
  }

  if (!projects || !users) {
    return <div>Failed to fetch data</div>;
  }

  return (
    <div className="bg-gray-400">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="lg:mx-20 lg:py-10 px-4 py-4"
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className=" font-semibold leading-7 text-gray-900 text-2xl">
              New Ticket
            </h2>
            <p className="mt-1 text-base leading-6 text-gray-600">
              Create a new work ticket
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                {/* Fetch TT Number here */}
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  TT Number
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="ttnumber"
                    placeholder=""
                    id="tt-number"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    disabled
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
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
              <div className="sm:col-span-1">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project
                </label>
                <div className="mt-2">
                  <select
                    id="project"
                    name="project"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option></option>
                    {projects &&
                      projects.map(
                        (project) =>
                          project.status === "Open" && (
                            <option key={project._id}>{project.name}</option>
                          )
                      )}
                  </select>
                  {error && (
                    <p className="font-medium text-red-500 text-sm pt-2">
                      *Check for empty values
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Assign to
                </label>
                <div className="mt-2">
                  <select
                    id="assignee"
                    name="assignee"
                    className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option></option>
                    {users &&
                      users.map((users) => {
                        return Number(users.classification) >= 3 ? (
                          <option
                            key={users._id}
                            value={`${users.id}`}
                          >{`${users.first_name} ${users.last_name} - (${users.role})`}</option>
                        ) : (
                          <option key={users._id} value={`${users.id}`}>{`${
                            users.first_name
                          } ${users.last_name} - (${
                            users.role
                          } - ${users.projects.map((project) => {
                            return project.name;
                          })})`}</option>
                        );
                      })}
                  </select>
                  {error && (
                    <p className="font-medium text-red-500 text-sm pt-2">
                      *Check for empty values
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Priority
                </label>
                <div className="mt-2">
                  <select
                    id="priority"
                    name="priority"
                    className="block w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Ticket Heading
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
                  Ticket Description
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
          <Link to="/">
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
        {showSuccessModal && !error && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md">
              <h2 className="text-2xl font-bold mb-4">Success!</h2>
              <p>Your Ticket has been successfully submitted. </p>
              <Link to="/">
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
      </>
    </div>
  );
}
