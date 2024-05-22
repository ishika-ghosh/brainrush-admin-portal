"use client";
import Loader from "@components/Loader";
import axios from "axios";
import { useState, useEffect } from "react";
function page() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

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
    </div>
  );
}

export default page;
