import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectLoggedInUser } from "../features/auth/authSlice";
import { getAllUsers } from "../features/auth/authAPI";
import { findTicketById, updateTicket } from "../features/ticket/ticketsAPI";

function TicketDetail() {
  const [data, setData] = useState(null);
  const [members, setMembers] = useState();
  const [firstSelectValue, setFirstSelectValue] = useState(false);
  const [secondSelectValue, setSecondSelectValue] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let params = useParams();

  const statusField = ["In Progress", "Completed"];

  const loggedInUser = useSelector(selectLoggedInUser);
  console.log(loggedInUser);

  function getIndianDateTime() {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
      timeZone: "Asia/Kolkata", // Indian Standard Time (IST)
    };

    const indianDateTime = new Date().toLocaleString("en-IN", options);
    return indianDateTime;
  }

  const updateTicketStatus = async (Ttdata) => {
    try {
      setLoading(true);
      const data = await updateTicket(Ttdata);
      if (data.message === "Success") {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  const fetchTicketById = async (id) => {
    try {
      const response = await findTicketById(id);
      setData(response);
      findTeamMembers();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const findTeamMembers = async () => {
    try {
      const res = await getAllUsers();
      if (Number(loggedInUser.classification) <= 2) {
        const team = res.data.filter(
          (user) => user.projects[0] === loggedInUser.projects[0]
        );
        setMembers(team);
      } else {
        const team = res.data.filter(
          (user) =>
            Number(user.classification) >=
              Number(loggedInUser.classification) - 1 &&
            Number(user.classification) <=
              Number(loggedInUser.classification) + 1
        );
        setMembers(team);
      }
    } catch (error) {
      setError(error);
    }
  };
  const handleAcceptTicket = async () => {
    try {
      const ticketData = {};
      ticketData.id = params.id;
      ticketData.status = "Accepted";
      await updateTicketStatus(ticketData);
      await fetchTicketById(params.id);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !e.target.status.value &&
      !e.target.personnel.value &&
      !e.target.priority.value
    ) {
      return;
    }
    try {
      const ticketData = {};
      ticketData.id = params.id;
      if (e.target.status.value) {
        ticketData.status = e.target.status.value;
      }
      //if completed sending tick to initator
      if (e.target.status.value && e.target.status.value === "Completed") {
        ticketData.assigned_to = `${data.initiator_id}`;
      }
      if (e.target.personnel.value) {
        ticketData.assigned_to = e.target.personnel.value;
      }
      if (e.target.priority.value) {
        ticketData.priority = e.target.priority.value;
      }
      if (
        // resending to assigned state when assigned to a new user
        e.target.personnel.value &&
        !e.target.priority.value &&
        !e.target.status.value
      ) {
        ticketData.status = "Assigned";
      }

      await updateTicketStatus(ticketData);
      await fetchTicketById(params.id);
      console.log(ticketData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const ticketData = {};
      ticketData.id = params.id;
      const todayIndianDateTime = getIndianDateTime();
      const Comments = [];
      if (data.comments.length !== 0) {
        data.comments.map((prevData) => Comments.push(prevData));
      }
      const comment = {};
      comment.data = e.target.comment.value;
      comment.user = `${loggedInUser.first_name} ${loggedInUser.last_name}`;
      comment.date = todayIndianDateTime;
      Comments.push(comment);
      ticketData.comments = Comments;
      console.log(ticketData);
      await updateTicketStatus(ticketData);
      await fetchTicketById(params.id);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  const handleFirstSelectChange = () => {
    setSecondSelectValue(true);
  };
  const handleSecondSelectChange = () => {
    setFirstSelectValue(true);
  };

  useEffect(() => {
    fetchTicketById(params.id);
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Can't Find Ticket</div>;
  }

  return (
    <>
      <div className="flex justify-end mr-4 gap-4 pt-20">
        {data.status === "Assigned" &&
        `${loggedInUser.first_name} ${loggedInUser.last_name}` ===
          `${data.assigned_to.first_name} ${data.assigned_to.last_name}` ? (
          <div className="flex gap-4">
            <button
              className="btn btn-warning btn-sm"
              onClick={(e) => handleAcceptTicket(e)}
            >
              Accept Ticket
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className=" col-span-2 card-container m-2 sm:m-5 ">
        <div className="card-heading">
          <h2 className="card-heading-text text-2xl">Ticket Details</h2>
        </div>
        <div className="border-2 grid lg:grid-cols-7 border-solid rounded-md pt-8 bg-gray-400">
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 p-4">
              {/* First Row */}
              <div className="">
                <h2 className="font-bold mb-1">Ticket Number</h2>
                <div className="border-b pb-1">{data.number}</div>
              </div>
              <div className=" flex justify-evenly border-b pb-1">
                <div>
                  <h2 className="font-bold mb-1">Project</h2>
                  <div className="">{`${data.project_name}`}</div>
                </div>
                <div>
                  <h2 className="font-bold mb-1">Initiated By</h2>
                  <div className="">{`${data.initiator}`}</div>
                </div>
              </div>
              {/* Second Row */}
              <div className="">
                <h2 className="font-bold mb-1">Creation Date</h2>
                <div className="border-b pb-1">{`${data.created_at},  ${data.created_time}(IST) `}</div>
              </div>
              <div className=" flex justify-evenly border-b pb-1">
                <div>
                  <h2 className="font-bold mb-1">{`Priority`}</h2>
                  {data.priority === "High" ? (
                    <div className="font-semibold text-red-600">{`${data.priority}`}</div>
                  ) : (
                    <div className="">{`${data.priority}`}</div>
                  )}
                </div>
                <div>
                  <h2 className="font-bold mb-1">{`Assigned To`}</h2>
                  <div className="">{`${data.assigned_to.first_name}  ${data.assigned_to.last_name}`}</div>
                </div>
              </div>
            </div>
            {/* Title */}
            <div className="mb-2 mx-4">
              <h2 className="font-bold mb-1">Title</h2>
              <div className="border-b pb-2">{data.title}</div>
            </div>
          </div>
          {/* Options */}
          <div className="lg:col-span-2 px-2 py-2">
            <form onSubmit={(e) => handleSave(e)}>
              <div className="grid grid-rows-3 border border-solid rounded-md pt-6 pb-3 bg-gray-400">
                <div className="row-span-1 grid grid-cols-3 py-2">
                  <div className="col-span-1 flex justify-center items-center">
                    <p className="text-sm font-medium">Priority :</p>
                  </div>
                  <div className="col-span-2 px-2">
                    <select
                      className="select select-bordered select-sm w-full max-w-xs py-0"
                      name="priority"
                    >
                      <option disabled selected value={""}>
                        Change Priority
                      </option>
                      {data.status !== "Assigned" &&
                      data.status !== "Closed" &&
                      `${loggedInUser.first_name} ${loggedInUser.last_name}` ===
                        data.initiator ? (
                        <>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High </option>
                        </>
                      ) : (
                        <></>
                      )}
                    </select>
                  </div>
                </div>
                <div className="row-span-1 grid grid-cols-3 py-2">
                  <div className="col-span-1 flex justify-center items-center">
                    <p className="text-sm font-medium">Assign to :</p>
                  </div>
                  <div className="col-span-2 px-2">
                    <select
                      className="select select-bordered select-sm w-full max-w-xs py-0"
                      name="personnel"
                      onChange={() => handleSecondSelectChange()}
                      disabled={secondSelectValue}
                    >
                      <option disabled selected value={""}>
                        Assign to Personnel
                      </option>
                      {data.status !== "Assigned" &&
                      data.status !== "Closed" &&
                      data.assigned_to.id === loggedInUser.id &&
                      members ? (
                        members.map((user) => (
                          <>
                            <option
                              value={`${user.id}`}
                            >{`${user.first_name} ${user.last_name} - (${user.role})`}</option>
                          </>
                        ))
                      ) : (
                        <></>
                      )}
                    </select>
                  </div>
                </div>
                <div className="row-span-1 grid grid-cols-3 py-2">
                  <div className="col-span-1 flex justify-center items-center">
                    <p className="text-sm font-medium">Status :</p>
                  </div>
                  <div className="col-span-2 px-2">
                    <select
                      className="select select-bordered select-sm w-full max-w-xs py-0"
                      name="status"
                      onChange={() => handleFirstSelectChange()}
                      disabled={firstSelectValue}
                    >
                      <option disabled selected value={""}>
                        {data.status}
                      </option>
                      {loggedInUser.id === data.assigned_to.id &&
                      data.status !== "Assigned" &&
                      data.status !== "Closed" ? (
                        data.status === "Completed" ? (
                          loggedInUser.id === data.initiator_id ? (
                            <option value="Closed">Close</option>
                          ) : (
                            <option value="">No options available</option>
                          )
                        ) : (
                          <>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </>
                        )
                      ) : (
                        <option value="">No options available </option>
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <button
                    className="btn btn-success btn-sm mt-2 mb-0"
                    type="Submit"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* Description */}
          <div className="lg:col-span-7 my-4 mx-4">
            <h2 className="font-bold mb-1">Ticket Description</h2>
            <div className="border-b pb-2">{data.description}</div>
          </div>
        </div>
      </div>

      <div className="lg:flex lg:flex-row">
        {/* Comment Field */}
        <div className="card-container m-2 sm:m-5 lg:w-4/6">
          <div className="card-heading">
            <h2 className="card-heading-text text-2xl">Comments</h2>
          </div>
          <div className="grid border-2 border-solid rounded-md pt-10 bg-gray-400">
            <div className="">
              <div>
                <form onSubmit={(e) => handleComment(e)}>
                  <div className="flex justify-center items-center gap-4 mt-2">
                    <div>
                      <textarea
                        type="text"
                        name="comment"
                        placeholder="Add Comment...."
                        className="input input-bordered lg:w-96 min-h-6 h-10 text-md"
                      />
                    </div>
                    <div>
                      <button className="btn btn-info btn-sm" type="Submit">
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 border-t mx-2">
                    {data.comments.length !== 0 ? (
                      <>
                        {data.comments.map((comment) => (
                          <div className="flex mx-2 py-2 border-b justify-center">
                            <p>
                              {`"${comment.data}"`}{" "}
                              <span className="text-sm"> - </span>
                              {comment.user}
                              <span className="text-sm">
                                {" "}
                                on {comment.date}
                              </span>
                            </p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="my-2 ">No Comments</div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Ticket Timeline */}
        <div className="card-container m-2 sm:m-5 lg:w-2/6">
          <div className="card-heading">
            <h2 className="card-heading-text text-2xl">Ticket Timeline</h2>
          </div>
          <div className="grid border-2 border-solid rounded-md pt-10 bg-gray-400">
            <div>
              <ul className="timeline timeline-vertical">
                <li>
                  <div className={`timeline-start timeline-box`}>Assigned</div>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <hr className="bg-primary" />
                </li>
                <li>
                  {data.status === "Accepted" ||
                  data.status === "In Progress" ||
                  data.status === "Completed" ||
                  data.status === "Closed" ? (
                    <hr className="bg-primary" />
                  ) : (
                    <hr className="" />
                  )}

                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill={"currentColor"}
                      className={`w-5 h-5 ${
                        data.status === "Accepted" ||
                        data.status === "In Progress" ||
                        data.status === "Completed" ||
                        data.status === "Closed"
                          ? "text-primary"
                          : ""
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-end timeline-box">Accepted</div>
                  {data.status === "Accepted" ||
                  data.status === "In Progress" ||
                  data.status === "Completed" ||
                  data.status === "Closed" ? (
                    <hr className="bg-primary" />
                  ) : (
                    <hr className="" />
                  )}
                </li>
                <li>
                  {data.status === "In Progress" ||
                  data.status === "Completed" ||
                  data.status === "Closed" ? (
                    <hr className="bg-primary" />
                  ) : (
                    <hr className="" />
                  )}
                  <div className="timeline-start timeline-box">
                    In Progress
                    {/* <span className="hidden-text-left rounded-xl">
                      sidhufksufaefiheafdoi aiojhdkasndf
                    </span> */}
                  </div>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill={"currentColor"}
                      className={`w-5 h-5 ${
                        data.status === "In Progress" ||
                        data.status === "Completed" ||
                        data.status === "Closed"
                          ? "text-primary"
                          : ""
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {data.status === "In Progress" ||
                  data.status === "Completed" ||
                  data.status === "Closed" ? (
                    <hr className="bg-primary" />
                  ) : (
                    <hr className="" />
                  )}
                </li>
                <li>
                  {data.status === "Completed" || data.status === "Closed" ? (
                    <hr className="bg-primary" />
                  ) : (
                    <hr className="" />
                  )}
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill={"currentColor"}
                      className={`w-5 h-5 ${
                        data.status === "Completed" || data.status === "Closed"
                          ? "text-primary"
                          : ""
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-end timeline-box">Completed</div>
                  {data.status === "Completed" || data.status === "Closed" ? (
                    <hr className="bg-primary" />
                  ) : (
                    <hr className="" />
                  )}
                </li>
                <li>
                  <hr />
                  <div className="timeline-start timeline-box">Closed</div>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill={"currentColor"}
                      className={`w-5 h-5 ${
                        data.status === "Closed" ? "text-primary" : ""
                      }`}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TicketDetail;
