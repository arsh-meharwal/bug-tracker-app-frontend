import React from "react";

const StaticCard = ({ title, data, selectedKeys }) => {
  return (
    <div className="card-container m-2 sm:m-5 ">
      <div className="card-heading">
        <h2 className="card-heading-text">{title}</h2>
      </div>
      <div className="double-column-container bg-white">
        {/* {Object.entries(items).map(([key, value], index) => (
          <div className="double-column-container-element" key={index}>
            <h3 className="font-semibold">{key}</h3>
            <p>{value}</p>
          </div>
        ))} */}
        <table>
          <thead>
            <tr>
              {selectedKeys.map((key) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaticCard;
