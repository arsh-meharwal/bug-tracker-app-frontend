import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import CardTable from "../features/cards/CardTable";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  deleteAllTicket,
  deleteTicket,
  getTickets,
} from "../features/ticket/ticketsAPI";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../features/auth/authSlice";
import LoadingSpinner from "../features/loader/LoadingSpinner";
import AssignedTickets from "../features/ticket/components/AssignedTicket";
import InitiatedTickets from "../features/ticket/components/InitiatedTicket";
import AllTickets from "../features/ticket/components/AllTickets";
import ClosedTickets from "../features/ticket/components/ClosedTicket";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const sortOptions = [
  {
    name: "Priority: High to Low",
    sort: "priority",
    order: "asc",
    current: false,
  },
  {
    name: "Priority: Low to High",
    sort: "priority",
    order: "desc",
    current: false,
  },
  { name: "Tickets Oldest", sort: "number", order: "asc", current: false },
  { name: "Tickets Latest", sort: "number", order: "desc", current: false },
];

function Tickets() {
  // const debounce = (func, delay) => {
  //   let timeout;
  //   return (...args) => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => func(...args), delay);
  //   };
  // };
  // const [query, setQuery] = useState({});
  // const [sort, setSort] = useState({ _sort: "number", _order: "desc" });
  const [allTickets, setAllTickets] = useState();
  const [assignedTickets, setAssignedTickets] = useState();
  const [initiatedTickets, setInitiatedTickets] = useState();
  const [closedTickets, setClosedTickets] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  let selectedKeys = ["number", "initiator", "title", "project_name", "status"];
  let tableHeading = ["TT Number", "Initiator", "Title", "Project", "Status"];
  const [totalPage, setTotalPage] = useState();
  const [paginatedTickets, setPaginatedTickets] = useState();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ _sort: "number", _order: "desc" });
  const [searchTerm, setSearchTerm] = useState("");

  // const debouncedSetQuery = debounce(setQuery, 800);
  let loggedInUser = useSelector(selectLoggedInUser);

  const fetchAllTTdata = async (sort) => {
    try {
      let res = await getTickets(sort);
      console.log(res.data);
      if (Number(loggedInUser.classification) <= 2) {
        setAllTickets(
          res.data.filter(
            (tt) =>
              tt.project_name === loggedInUser.projects[0].name &&
              tt.status !== "Closed"
          )
        );
      } else {
        setAllTickets(res.data);
      }
      const assigned = res.data.filter(
        (tt) => tt.assigned_to === loggedInUser.id && tt.status !== "Closed"
      );
      const initiated = res.data.filter(
        (tt) => tt.initiator_id === loggedInUser.id && tt.status !== "Closed"
      );
      const closed = res.data.filter((tt) => tt.status === "Closed");
      setAssignedTickets(assigned);
      setInitiatedTickets(initiated);
      setClosedTickets(closed);
      setTotalPage(Math.ceil(closed.length / 10));
      paginate(closed, page, 10);
    } catch {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    setSort(sort);
  };

  async function handleDel(id) {
    setLoading(true);
    await deleteTicket(id);
    fetchAllTTdata();
    setLoading(false);
  }
  async function handleAllDel() {
    setLoading(true);
    await deleteAllTicket();
    fetchAllTTdata();
    setLoading(false);
  }

  function paginate(array, page, pageSize) {
    if (array !== null) {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setPaginatedTickets(array.slice(startIndex, endIndex));
    }
  }
  function search(array, term) {
    if (array !== null) {
      const filteredTickets = array.filter(
        (item) =>
          item.description.toLowerCase().includes(term.toLowerCase()) ||
          item.title.toLowerCase().includes(term.toLowerCase()) ||
          item.number.includes(term)
      );
      setTotalPage(Math.ceil(filteredTickets.length / 10));
      setPaginatedTickets(filteredTickets.slice(0, 10));
    }
  }
  function handleSearch(e) {
    const term = e.target.value;
    setSearchTerm(term);
    search(closedTickets, term);
    setPage(1); // Reset page to 1 when performing a new search
  }

  const handlePage = (page) => {
    setPage(page);
  };

  // useEffect(() => {

  // }, [page]);

  useEffect(() => {
    fetchAllTTdata(sort);
    if (closedTickets) {
      paginate(closedTickets, page, 10);
    }
  }, [sort, page]);

  if (loading) {
    return (
      <div className="bg-gray-600">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!allTickets) {
    return <div>Failed to fetch Tickets</div>;
  }

  return (
    <div
      className="bg-gray-600 lg:pt-20 lg:px-4 pr-4 pt-20"
      style={{ minWidth: "800px" }}
    >
      {Number(loggedInUser.classification) >= 2 ? (
        <div className="lg:pb-4 pb-20">
          <Link to="/createticket">
            <button className="btn btn-success btn-sm">
              Create New Ticket
            </button>
          </Link>
        </div>
      ) : (
        <></>
      )}
      <AssignedTickets tickets={assignedTickets} />
      <AllTickets tickets={allTickets} />
      {Number(loggedInUser.classification) >= 2 && (
        <InitiatedTickets tickets={initiatedTickets} />
      )}

      {/* Closed TTs only for admins */}
      {Number(loggedInUser.classification) >= 4 && (
        <>
          <div className="card-container lg:pt-2 lg:pb-20 py-96">
            <div className="card-heading flex flex-col min-h-16">
              <div className="mx-4">
                <h2 className="card-heading-text text-3xl font-body font-bold">
                  Closed Tickets
                </h2>
              </div>
              <div className="">
                <p className="text-base text-white font-light font-sans">
                  All Closed TTs
                </p>
              </div>
            </div>
            <div className=" bg-gray-400 grid border-2 border-solid rounded-md pt-10">
              <div className=" flex justify-between items-center">
                {/* Sort button */}
                <span className="ml-5 ">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Sort
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {sortOptions.map((option) => (
                            <Menu.Item key={option.name}>
                              {({ active }) => (
                                <p
                                  onClick={(e) => handleSort(e, option)}
                                  className={classNames(
                                    option.current
                                      ? "font-medium text-gray-900"
                                      : "text-gray-500",
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  {option.name}
                                </p>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </span>
                {/* Del ALL button */}
                <div className="pr-72">
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => handleAllDel()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                    Delete All Closed
                  </button>
                </div>

                {/* Search Input  */}
                <input
                  type="text"
                  placeholder="Search..."
                  className="input input-bordered input-sm w-full max-w-52 mr-5"
                  onChange={handleSearch}
                />
              </div>
              {/* Table */}
              <div className="mx-4 py-4">
                <div className="pb-2">
                  <div className={`grid `}>
                    <table className="min-w-full ">
                      <thead className="border-b-2 border-gray-600">
                        <tr>
                          {tableHeading.map((key) => (
                            <th key={key} className="pb-2">
                              {key}
                            </th>
                          ))}
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTickets &&
                          paginatedTickets.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-600"
                            >
                              {selectedKeys.map((key) => (
                                <td
                                  key={key}
                                  className="py-1 text-sm text-black"
                                >
                                  {key === "title" ? (
                                    <span>
                                      {item[key]
                                        .split("")
                                        .slice(0, 55)
                                        .join("")}
                                      {item[key].split("").length > 10
                                        ? "...."
                                        : ""}
                                    </span>
                                  ) : (
                                    item[key]
                                  )}
                                </td>
                              ))}
                              <td>
                                <Link
                                  to={`/tickets/${item.id}`}
                                  className="link link-primary"
                                >
                                  detail
                                </Link>
                              </td>

                              <td>
                                <button
                                  className="pt-1"
                                  onClick={() => handleDel(item.id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="lucide lucide-trash-2"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" x2="10" y1="11" y2="17" />
                                    <line x1="14" x2="14" y1="11" y2="17" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Pagination Tab */}
              <div className="flex justify-between items-center pb-2">
                <span className="ml-5">Showing 10 entries</span>
                <div className="join mr-5">
                  <button
                    className="join-item btn"
                    onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
                  >
                    «
                  </button>
                  <button className="join-item btn">
                    Page {page} of {totalPage}
                  </button>
                  <button
                    className="join-item btn"
                    onClick={(e) =>
                      handlePage(page < totalPage ? page + 1 : page)
                    }
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Tickets;
