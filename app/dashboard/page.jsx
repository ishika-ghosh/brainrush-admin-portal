"use client";
import Loader from "@components/Loader";
import axios from "axios";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
function page() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const generateExcel = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-details`,
        { all: false }
      );

      console.log(data.results);
      if (data.success) {
        alert(data?.message);
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(data.results);
        XLSX.utils.book_append_sheet(wb, ws, "BrainRush_Certificate");
        XLSX.writeFile(wb, "BrainRush_Certificate.xlsx");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  const generateExcelForAllTeam = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-details`,
        { all: true }
      );

      console.log(data.results);
      if (data.success) {
        alert(data?.message);
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(data.results);
        XLSX.utils.book_append_sheet(wb, ws, "BrainRush_TeamDetails");
        XLSX.writeFile(wb, "BrainRush_Team.xlsx");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getAllDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-details`
        );
        console.log(data);
        setDetails(data);
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };
    getAllDetails();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <div
      id="fullWidthTabContent"
      className="border-t border-gray-200 dark:border-gray-600"
    >
      <div
        className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800"
        id="stats"
        role="tabpanel"
        aria-labelledby="stats-tab"
      >
        <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8">
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">{details?.users}</dt>
            <dd className=" text-center text-gray-500 dark:text-gray-400">
              Users
            </dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">{details?.teams}</dt>
            <dd className="text-center text-gray-500 dark:text-gray-400">
              Teams Registerd till date
            </dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">
              {details?.teamsWithPayment}
            </dt>
            <dd className="text-center text-gray-500 dark:text-gray-400">
              Teams Completed Payment till date
            </dd>
          </div>

          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">
              {details?.teamsAttended}
            </dt>
            <dd className="text-center text-gray-500 dark:text-gray-400">
              Teams Attending the event
            </dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">
              {details?.todaysTransactions}
            </dt>
            <dd className="text-center text-gray-500 dark:text-gray-400">
              Today's transactions
            </dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">
              {details?.transactions}
            </dt>
            <dd className="text-center text-gray-500 dark:text-gray-400">
              Total payments till date
            </dd>
          </div>
        </dl>
      </div>
      <div className="pulsating-circle"></div>
      <button
        type="button"
        data-modal-toggle="edit-user-modal"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        onClick={generateExcel}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
          <path
            fillRule="evenodd"
            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
            clipRule="evenodd"
          ></path>
        </svg>
        Generate Certificate Excel
      </button>
      <button
        type="button"
        data-modal-toggle="edit-user-modal"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ml-2"
        onClick={generateExcelForAllTeam}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
          <path
            fillRule="evenodd"
            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
            clipRule="evenodd"
          ></path>
        </svg>
        Generate All team Excel
      </button>
    </div>
  );
}

export default page;
