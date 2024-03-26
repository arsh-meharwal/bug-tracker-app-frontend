import React from "react";
import { Link } from "react-router-dom";

function CardTable({ tableHeading, data, selectedKeys, link }) {
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
