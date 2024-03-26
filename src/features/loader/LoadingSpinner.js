import React from "react";

function LoadingSpinner() {
  return (
    <div className="">
      <div className=" content fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-md">
          <button className="btn btn-square">
            <span className="loading loading-spinner"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
