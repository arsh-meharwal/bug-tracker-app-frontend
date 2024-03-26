import React, { useEffect, useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProjectsAsync,
  selectAllProject,
  selectTotalItems,
} from "../features/project/projectSlice";
import CardTable from "../features/cards/CardTable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const sortOptions = [
  { name: "Projects Oldest", sort: "created", order: "asc", current: false },
  { name: "Projects Latest", sort: "created", order: "desc", current: false },
];

export default function Project() {
  let selectedKeys = ["name", "description", "initiator"];
  let tableHeading = ["Project Name", "Project Description", "Created By"];
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState({});
  const [sort, setSort] = useState({});

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    setSort(sort);
  };

  function handleSearch(e) {
    //need to add debouncing
    let searchValue = e.target.value || "";
    const search = { _q: searchValue };
    setQuery(search);
  }

  function handlePage(pge) {
    setPage(pge);
  }

  useEffect(() => {
    const paginate = { _page: page, _limit: 7 };
    dispatch(getAllProjectsAsync({ paginate, query, sort }));
  }, [query, sort, page, dispatch]);

  let data = useSelector(selectAllProject);
  let totalItems = useSelector(selectTotalItems);
  let totalPages = Math.ceil(totalItems / 7);

  return (
    <div style={{ minWidth: "800px" }} className="bg-gray-600 py-96 lg:py-2">
      <div className="lg:py-16 pt-24 pb-96 lg:px-4 ">
        <div className="lg:pb-2 pb-20">
          <Link to="/createproject">
            <button className="btn btn-success btn-sm">
              Create New Project
            </button>
          </Link>
        </div>
        <div className="card-container m-2 sm:m-5 ">
          <div className="card-heading flex flex-col min-h-16">
            <div className="mx-5">
              <h2 className="card-heading-text text-3xl font-body font-bold">
                Projects{" "}
              </h2>
            </div>
            <div className="">
              <p className="text-base text-white font-light font-sans">
                Total projects being worked upon
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
                link={"project"}
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
    </div>
  );
}
