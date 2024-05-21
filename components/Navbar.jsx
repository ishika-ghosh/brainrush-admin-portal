"use client";

// import { useEffect, useState } from "react";

function Navbar() {
  // const [adminDetails, setAdminDetails] = useState(null);
  // useEffect(() => {
  //   const getDetails = async () => {
  //     const { admin } = ;
  //     setAdminDetails(admin);
  //   };
  //   getDetails();
  // }, []);

  return (
    <nav className="ml-80 margin-responsive bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/dashboard" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            BrainRush 2024
          </span>
        </a>
        {/* <div className="flex items-center md:order-2">
          <span className="mr-7 self-center text-m font-semibold whitespace-nowrap dark:text-white">
            {adminDetails?.name.split("@")[0]}
          </span>
          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-red-600 rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-200 dark:text-gray-100">
              {adminDetails?.name[0]}
            </span>
          </div>
        </div> */}
      </div>
    </nav>
  );
}

export default Navbar;
