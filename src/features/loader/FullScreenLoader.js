import React from "react";

function FullScreenLoader() {
  return (
    // <div className="">
    //   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    //     <div className="bg-white p-6 rounded-md">
    //       <button className="btn btn-square">
    //         <span className="loading loading-spinner"></span>
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="flex items-center justify-center bg-gray-400 h-screen">
      <div className="flex flex-col gap-4 w-52">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </div>
  );
}

export default FullScreenLoader;
