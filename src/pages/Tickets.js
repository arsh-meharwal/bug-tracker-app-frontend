import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import CardTable from "../features/cards/CardTable";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { getTickets } from "../features/ticket/ticketsAPI";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../features/auth/authSlice";
import LoadingSpinner from "../features/loader/LoadingSpinner";

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
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };
  let selectedKeys = ["number", "initiator", "title", "project_name", "status"];
  let tableHeading = ["TT Number", "Initiator", "Title", "Project", "Status"];
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState({});
  const [sort, setSort] = useState({ _sort: "number", _order: "desc" });
  const [allTickets, setAllTickets] = useState();
  const [totalTicketsNumber, setTotalTicketsNumber] = useState();
  const [assignedTickets, setAssignedTickets] = useState();
  const [assignedTicketsNum, setAssignedTicketsNum] = useState();
  const [initiatedTickets, setInitiatedTickets] = useState();
  const [initiatedTicketsNum, setInitiatedTicketsNum] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const debouncedSetQuery = debounce(setQuery, 800);
  let loggedInUser = useSelector(selectLoggedInUser);

  const fetchdata = async (paginate, query, sort) => {
    try {
      const response = await getTickets(paginate, query, sort);
      const data = response.data;
      if (Number(loggedInUser.classification) <= 2) {
        setAllTickets(
          data.filter((tt) => tt.project_name === loggedInUser.projects[0].name)
        );
      } else {
        setAllTickets(data);
      }
      setTotalTicketsNumber(response.totalItems);
      const assigned = data.filter((tt) => tt.assigned_to === loggedInUser.id);
      const initiated = data.filter(
        (tt) => tt.initiator_id === loggedInUser.id
      );
      setAssignedTickets(assigned);
      console.log(initiated.length);
      setAssignedTicketsNum(Math.ceil(assigned.length / 7));
      setInitiatedTickets(initiated);
      setInitiatedTicketsNum(Math.ceil(initiated.length / 7));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    setSort(sort);
  };

  function handleSearch(e) {
    //need to add debouncing
    let searchValue = e.target.value || "";
    const search = { _q: searchValue };
    debouncedSetQuery(search);
  }

  function handlePage(page) {
    setPage(page);
  }

  useEffect(() => {
    const paginate = { _page: page, _limit: 7 };
    fetchdata(paginate, query, sort);
  }, [query, sort, page]);

  let data = allTickets;

  let totalPages = Math.ceil(totalTicketsNumber / 7);

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

      <div className="card-container lg:pt-2 lg:pb-20 py-96">
        <div className="card-heading flex flex-col min-h-16">
          <div className="mx-4">
            <h2 className="card-heading-text text-3xl font-body font-bold">
              Assigned Tickets
            </h2>
          </div>
          <div className="">
            <p className="text-base text-white font-light font-sans">
              Tickets Assigned to you
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
            <CardTable
              tableHeading={tableHeading}
              data={assignedTickets}
              selectedKeys={selectedKeys}
              link={"tickets"}
            />
          </div>
          {/* Pagination Tab */}
          <div className="flex justify-between items-center pb-2">
            <span className="ml-5">Showing 7 entries / page</span>
            <div className="join mr-5">
              <button
                className="join-item btn"
                onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
              >
                «
              </button>
              <button className="join-item btn">
                Page {page} of {assignedTicketsNum}
              </button>
              <button
                className="join-item btn"
                onClick={(e) =>
                  handlePage(page < assignedTicketsNum ? page + 1 : page)
                }
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-container lg:pt-2 lg:pb-20 py-96">
        <div className="card-heading flex flex-col min-h-16">
          <div className="mx-4">
            <h2 className="card-heading-text text-3xl font-body font-bold">
              Initiated Tickets
            </h2>
          </div>
          <div className="">
            <p className="text-base text-white font-light font-sans">
              Tickets Initiated by you
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
            <CardTable
              tableHeading={tableHeading}
              data={initiatedTickets}
              selectedKeys={selectedKeys}
              link={"tickets"}
            />
          </div>
          {/* Pagination Tab */}
          <div className="flex justify-between items-center pb-2">
            <span className="ml-5">Showing 7 entries / page</span>
            <div className="join mr-5">
              <button
                className="join-item btn"
                onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
              >
                «
              </button>
              <button className="join-item btn">
                Page {page} of {initiatedTicketsNum}
              </button>
              <button
                className="join-item btn"
                onClick={(e) =>
                  handlePage(page < initiatedTicketsNum ? page + 1 : page)
                }
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-container lg:py-4 py-96">
        <div className="card-heading flex flex-col min-h-16">
          <div className="mx-4">
            <h2 className="card-heading-text text-3xl font-body font-bold">
              All Tickets
            </h2>
          </div>
          <div className="">
            <p className="text-base text-white font-light font-sans">
              All Tickets in the Database
            </p>
          </div>
        </div>
        <div className=" bg-gray-400 grid border-2 border-solid rounded-md pt-10 lg:mb-6 sm:mb-4">
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
            {/* Search Input  */}
            <input
              type="text"
              placeholder="Search..."
              className="input input-bordered input-sm w-full max-w-xs mr-5"
              onChange={handleSearch}
            />
          </div>
          {/* Table */}
          <div className="min-h-60 lg:mx-4 py-2">
            <CardTable
              tableHeading={tableHeading}
              data={data}
              selectedKeys={selectedKeys}
              link={"tickets"}
            />
          </div>
          {/* Pagination Tab */}
          <div className="flex justify-between items-center pb-2">
            <span className="ml-5">Showing 7 entries</span>
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
                onClick={(e) => handlePage(page < totalPages ? page + 1 : page)}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tickets;
