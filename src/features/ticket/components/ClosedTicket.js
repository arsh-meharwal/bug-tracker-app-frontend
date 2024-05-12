import React, { useEffect, useState, Fragment } from "react";
import CardTable from "../../cards/CardTable";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { getTickets } from "../../ticket/ticketsAPI";
import LoadingSpinner from "../../loader/LoadingSpinner";
import { selectLoggedInUser } from "../../auth/authSlice";
import { useSelector } from "react-redux";

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

export default function ClosedTickets({ tickets }) {
  //   const debounce = (func, delay) => {
  //     let timeout;
  //     return (...args) => {
  //       clearTimeout(timeout);
  //       timeout = setTimeout(() => func(...args), delay);
  //     };
  //   };
  let selectedKeys = ["number", "initiator", "title", "project_name", "status"];
  let tableHeading = ["TT Number", "Initiator", "Title", "Project", "Status"];
  const [data, setData] = useState(tickets);
  const [totalPage, setTotalPage] = useState(Math.ceil(tickets.length / 10));
  const [paginatedTickets, setPaginatedTickets] = useState();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ _sort: "number", _order: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  let loggedInUser = useSelector(selectLoggedInUser);

  const fetchdata = async (sort) => {
    try {
      const response = await getTickets(sort);
      const data = response.data.filter(
        (tt) => tt.assigned_to === loggedInUser.id
      );
      setData(data);
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
    search(tickets, term);
    setPage(1); // Reset page to 1 when performing a new search
  }

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    paginate(data, page, 10);
  }, [page]);

  useEffect(() => {
    fetchdata(sort);
    paginate(data, page, 10);
  }, [sort]);

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

  if (!data) {
    return <div>Failed to fetch Tickets</div>;
  }

  return (
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
            <div className="pr-72">
              <button className="btn btn-sm btn-ghost">
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
                Delete All Tickets
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
            <CardTable
              tableHeading={tableHeading}
              data={paginatedTickets}
              selectedKeys={selectedKeys}
              link={"tickets"}
              del={true}
            />
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
                onClick={(e) => handlePage(page < totalPage ? page + 1 : page)}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
