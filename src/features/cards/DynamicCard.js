// Inside the component file
import React from "react";
const sampleData = {
  "Ticket Number": ["202031100", "20103440", "20103440", "20103440"],
  Initiator: ["ashok", "hera", "hera", "hera"],
  Email: [
    "ashok@gmail.com",
    "hera@gmail.com",
    "hera@gmail.com",
    "hera@gmail.com",
  ],
  Project: ["Ebix", "Facebook", "Facebook", "Facebook"],
  "Creation Date": ["10/12/2023", "23/06/2022", "23/06/2022", "23/06/2022"],
};

const DynamicCard = ({
  cardTitle,
  cardSubtitle,
  data,
  selectedKeys,
  tableHeading,
  search,
  pagination,
}) => {
  return (
    <div className="card-container m-2 sm:m-5 ">
      <div className="card-heading flex flex-col min-h-16">
        <div className="mx-4">
          <h2 className="card-heading-text text-2xl">{cardTitle}</h2>
        </div>
        <div className="pt-1">
          <p className="text-md text-white">{cardSubtitle}</p>
        </div>
      </div>
      <div className=" bg-gray-300 grid grid-rows-4 border-2 border-solid rounded-md pt-8 lg:mb-6 sm:mb-4">
        <div className="row-span-1 flex justify-between items-center">
          <span className="ml-5"></span>
          {/* Search Input here */}
          {search}
        </div>
        <div className="row-span-2 pb-8">
          <div className={`grid `}>
            <table>
              <thead>
                <tr>
                  {tableHeading.map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {selectedKeys.map((key) => (
                      <td key={key}>{item[key]}</td>
                    ))}
                    <td>
                      <a
                        href={`/link1/${item.id}`}
                        className="link link-primary"
                      >
                        detail
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* {Object.keys(sampleData).map((key, index) => (
              <div key={index} className="">
                <h3 className="font-semibold border-b-2 mb-1 p-1 text-sm sm:text-sm lg:text-base">
                  {key}
                </h3>
                <ul>
                  {sampleData[key].map((value, valueIndex) => (
                    <li
                      key={valueIndex}
                      className="border-b p-1 text-xs sm:text-xs lg:text-sm"
                    >
                      {index === 0 ? (
                        <a href="#" className="inline-block text-sky-500">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))} */}
          </div>
        </div>
        <div className="row-span-1 flex justify-between items-center pb-2">
          <span className="ml-5">Showing 10 entries</span>
          {pagination}
        </div>
      </div>
    </div>
  );
};

export default DynamicCard;
