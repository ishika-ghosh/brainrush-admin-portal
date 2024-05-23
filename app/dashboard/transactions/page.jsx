"use client";
import { useState, useEffect } from "react";
import { Modal } from "@components/Modal";
import axios from "axios";
import { useRouter } from "next/navigation";

function Transactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [times, setTimes] = useState({
    startTime: new Date(),
    endTime: new Date(),
  });
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`/api/transactions`);
        const data = await response.json();
        console.log(data);
        setTransactions(data.transactions);
      } catch (error) {
        console.log(error);
        router.push("/dashboard");
      }
    };
    getData();
  }, []);
  const deleteTransaction = async (id) => {
    try {
      const { data } = await axios.delete(`/api/transactions/${id}`);
      if (data.success) {
        alert("Data successfully deleted");
        setTransactions(
          transactions.filter((transaction) => transaction._id !== id)
        );
      } else {
        alert("Something went wrong, Please try again");
      }
    } catch (error) {
      console.log(error);
      router.push("/dashboard");
    }
  };
  const handleSubmit = async () => {
    console.log(times);
    if (times.startTime > times.endTime) {
      alert("start should be less than end time");
      return;
    }
    try {
      const { data } = await axios.get(
        `/api/transactions?start-time=${new Date(
          times.startTime
        )}&end-time=${new Date(times.endTime)}`
      );
      setTransactions(data.transactions);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {openModal && (
        <Modal
          closeModal={() => setOpenModal(false)}
          showInput={false}
          modalData={times}
          setModalData={setTimes}
          handleUpdate={handleSubmit}
        />
      )}
      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700 ">
        <div className="w-full mb-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              All Transactions
            </h1>
          </div>
          <div className="sm:flex">
            {/* Team Name and Admin Name */}
            <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
              <div className="lg:pr-3">
                <label htmlFor="users-search" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <input
                    type="text"
                    name="email"
                    id="users-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search Names"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
              {/* Filters */}
              {transactions?.length ? (
                <button
                  href="/dashboard/create-user"
                  type="button"
                  data-modal-toggle="add-user-modal"
                  className="mr-10 inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={() => setOpenModal(true)}
                >
                  <svg
                    className="w-5 h-5 mr-2 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Filter
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Admin
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Team Name
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Leader Email
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Date of Payment
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {transactions?.map((transaction) => (
                    <tr
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      key={transaction._id}
                    >
                      <td className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          <div className="text-base font-semibold text-gray-900 dark:text-white">
                            {transaction.admin.username.split("@")[0]}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="text-sm font-normal text-gray-800 dark:text-gray-400">
                          {transaction.admin.isSuperAdmin ? "SA" : "A"}
                        </div>
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="text-sm font-normal text-gray-800 dark:text-gray-400">
                          {transaction.team.teamName}
                        </div>
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="text-sm font-normal text-gray-800 dark:text-gray-400">
                          {transaction.team.leader.email}
                        </div>
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="text-sm font-normal text-gray-800 dark:text-gray-400">
                          {transaction.createdAt.split("T")[0]}
                        </div>
                      </td>

                      <td className="p-4 space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          data-modal-toggle="delete-user-modal"
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                          onClick={() => deleteTransaction(transaction._id)}
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Delete Transaction
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Transactions;
