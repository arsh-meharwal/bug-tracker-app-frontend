import React from "react";
import { Link } from "react-router-dom";
import { deleteTicket } from "../ticket/ticketsAPI";
import LoadingSpinner from "../loader/LoadingSpinner";
import FullScreenLoader from "../loader/FullScreenLoader";
import { useState } from "react";

function CardTable({ tableHeading, data, selectedKeys, link, del }) {
  let [loading, setLoading] = useState(false);
  async function handleDel(id) {
    setLoading(true);
    await deleteTicket(id);
    setLoading(false);
  }
  if (loading) return <FullScreenLoader />;
  return (
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
            {data != null ? (
              data.map((item, index) => (
                <tr key={index} className="border-b border-gray-600">
                  {selectedKeys.map((key) => (
                    <td key={key} className="py-1 text-sm text-black">
                      {key === "title" ? (
                        <span>
                          {item[key].split("").slice(0, 55).join("")}
                          {item[key].split("").length > 10 ? "...." : ""}
                        </span>
                      ) : (
                        item[key]
                      )}
                    </td>
                  ))}
                  <td>
                    <Link
                      to={`/${link}/${item.id}`}
                      className="link link-primary"
                    >
                      detail
                    </Link>
                  </td>
                  {del && (
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
                  )}
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CardTable;
