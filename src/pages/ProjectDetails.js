import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardTable from "../features/cards/CardTable";
import { findProjectById, updateProject } from "../features/project/projectAPI";
import LoadingSpinner from "../features/loader/LoadingSpinner";

export default function ProjectDetails() {
  const [data, setData] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [totalPage, setTotalPage] = useState();
  const [paginatedTickets, setPaginatedTickets] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let params = useParams();

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

  const fetchData = async (id) => {
    try {
      const response = await findProjectById(id);
      setData(response);
      setTickets(response.tickets);
      search(response.tickets, searchTerm); // Search on initial data
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = {};
      data.id = params.id;
      if (e.target.status.value) {
        data.status = e.target.status.value;
      }
      setLoading(true);
      const response = await updateProject(data);
      if (response.status === "Success") {
        setLoading(false);
        await fetchData(params.id);
      } else {
        setError(response);
        await fetchData(params.id);
        setLoading(false);
      }
    } catch (error) {
      setError(error);
    }
  };

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
    fetchData(params.id);
  }, [params.id]);
  useEffect(() => {
    paginate(tickets, page, 10);
  }, [page]);

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

  if (!data) {
    return <div>Can't Find Ticket</div>;
  }

  return (
    <div className="pt-16">
      <div className=" col-span-2 card-container m-2 sm:m-5 ">
        <div className="card-heading">
          <h2 className="card-heading-text text-2xl">
            Project Details - {data.name}
          </h2>
        </div>
        <div className="border-2 grid lg:grid-cols-7 border-solid rounded-md pt-8 bg-gray-400">
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 p-4">
              {/* First Row */}
              <div className="">
                <h2 className="font-bold mb-1">Creation Date</h2>
                <div className="border-b pb-1">{data.created}</div>
              </div>
              <div className="">
                <h2 className="font-bold mb-1">Initiator</h2>
                <div className="border-b pb-1">{data.initiator}</div>
              </div>
            </div>
            {/* Title */}
            <div className="mb-2 mx-4">
              <h2 className="font-bold mb-1">Project Title</h2>
              <div className="border-b pb-1">{data.name}</div>
            </div>
          </div>
          {/* box */}
          <div className="lg:col-span-2 px-2 py-2">
            <form onSubmit={(e) => handleSave(e)}>
              <div className="grid grid-rows-2 border border-solid rounded-md py-6 bg-gray-400">
                <div className="row-span-1 grid grid-cols-3 py-2">
                  <div className="col-span-1 flex justify-center items-center">
                    <p className="text-base font-medium">Status :</p>
                  </div>
                  <div className="col-span-2 px-2">
                    <select
                      className="select select-bordered select-sm w-full max-w-xs py-0"
                      name="status"
                    >
                      <option disabled selected>
                        {data.status}
                      </option>
                      <option className="">Open</option>
                      <option>Hold</option>
                    </select>
                  </div>
                </div>
                <div className="row-span-1 py-2">
                  <div className="flex justify-center">
                    <button className="btn btn-success btn-sm" type="Submit">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {/* Desc */}
          <div className="lg:col-span-7 my-4 mx-4">
            <h2 className="font-bold mb-1">Project Description</h2>
            <div className="border-b pb-2">{data.description}</div>
          </div>
        </div>
      </div>

      <div className="lg:py-4 sm:py-2">
        <div className="card-container m-2 sm:m-5">
          <div className="card-heading">
            <h2 className="card-heading-text text-2xl">
              Tickets for this Project
            </h2>
          </div>

          <div className="grid border-2 border-solid rounded-md bg-gray-400 pt-12 lg:px-4 sm:px-2 pb-6 ">
            <div className="pb-3 pt-1">
              <input
                type="text"
                placeholder="Search..."
                className="input input-bordered input-sm w-full max-w-xs mr-5 "
                onChange={(e) => handleSearch(e)}
              />
            </div>
            <div className="min-h-60">
              <CardTable
                tableHeading={[
                  "TT Number",
                  "Initiator",
                  "Title",
                  "Project",
                  "Status",
                ]}
                data={paginatedTickets}
                selectedKeys={[
                  "number",
                  "initiator",
                  "title",
                  "project_name",
                  "status",
                ]}
                link={"tickets"}
              />
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="ml-5">Showing 10 entries</span>
              <div className="join mr-5">
                <button
                  className="join-item btn"
                  onClick={(e) => handlePage(page > 1 ? page - 1 : page)}
                >
                  «
                </button>
                <button className="join-item btn">Page {page}</button>
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
      </div>
    </div>
  );
}
