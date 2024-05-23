"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Loader from "@components/Loader";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Teams() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const handler = async () => {
      try {
        const { data } = await axios.get(
          `/api/teams?search=${search}&filter=${filter}&page=${pageNum}`
        );
        console.log("am all time useEffect" + data.teams);
        setTeams(data.teams);
        setCount(data.count);
      } catch (error) {
        console.log(error);
        router.push("/dashboard");
      }
    };
    handler();
  }, [filter, search, pageNum]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/teams`);
        setLoading(false);
        setTeams(data.teams);
        setLimit(data.limit);
        setCount(data.count);
        console.log("am first time useEffect" + data.teams);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700 ">
        <div className="w-full mb-1">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              All Teams
            </h1>
          </div>
          <div className="sm:flex">
            <div className="items-center mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
              <div className="lg:pr-3">
                <label htmlFor="teams-search" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <input
                    type="text"
                    name="email"
                    id="teams-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search for teams"
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center ml-auto space-x-2 sm:space-x-3 mr-5">
              <div className="flex items-center ml-auto space-x-2">
                <input
                  type="radio"
                  value="First"
                  name="event"
                  onChange={() => {
                    setFilter("first");
                  }}
                />{" "}
                <div>First</div>
                <input
                  type="radio"
                  value="Second"
                  name="event"
                  onChange={() => {
                    setFilter("second");
                  }}
                />{" "}
                <div>Second</div>
                <input
                  type="radio"
                  value="Female"
                  name="event"
                  onChange={() => {
                    setFilter("lunch");
                  }}
                />{" "}
                <div>Lunch</div>
                <input
                  type="radio"
                  value="Other"
                  name="event"
                  onChange={() => {
                    setFilter("third");
                  }}
                />{" "}
                <div>Final</div>
              </div>
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
                      team
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Team name
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Team Leader
                    </th>

                    <th
                      scope="col"
                      className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                    >
                      Entry time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 cursor-pointer">
                  {teams?.map((team) => (
                    <tr
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 "
                      key={team._id}
                      onClick={() => {
                        router.push(`/dashboard/teams/${team._id}`);
                        // router.push(`/dashboard/teams/${team._id}`);
                      }}
                    >
                      <td className="flex items-center p-4  space-x-6 whitespace-nowrap">
                        <div className="flex -space-x-4">
                          <Image
                            className="border-2 border-white rounded-full dark:border-gray-800"
                            src={team.team.leader.image}
                            width="35"
                            height="35"
                            alt=""
                          />
                        </div>
                      </td>
                      <td className="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">
                        <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          <div className="text-base font-semibold text-gray-900 dark:text-white">
                            {team.team.teamName}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="text-sm font-normal text-gray-800 dark:text-gray-400">
                          <div className="font-medium dark:text-white">
                            <div>{team.team.leader.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {team.team.leader.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="text-sm font-normal text-gray-800 dark:text-gray-400">
                          {team.createdAt.split("T")[1].split(".")[0]}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-10 left-1/2 bottom-0">
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(count, (pageNum - 1) * limit + 1)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(count, pageNum * limit)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {count}
            </span>{" "}
            Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => {
                setPageNum((prev) => {
                  return Math.max(prev - 1, 1);
                });
              }}
            >
              <svg
                className="w-3.5 h-3.5 mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Prev
            </button>
            <button
              className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => {
                setPageNum((prev) => {
                  return Math.min(
                    prev + 1,
                    Math.floor((count - 1) / limit) + 1
                  );
                });
              }}
            >
              Next
              <svg
                className="w-3.5 h-3.5 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Teams;
