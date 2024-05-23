"use client";
import TeamDetails from "@components/TeamDetails";
import Updates from "@components/Updates";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Scanner() {
  const [paymentStatus, setPaymentStatus] = useState(false);
  const router = useRouter();
  const [entryStatus, setEntryStatus] = useState(false);
  const [lunchStatus, setLunchStatus] = useState(false);
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [timings, setTimings] = useState(null);
  const [eventData, setEventData] = useState(null);
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      // qrbox: {
      //   width: 300,
      //   height: 300,
      // },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    async function onScanSuccess(qrCodeMessage) {
      scanner.clear();
      setTeamId(qrCodeMessage);
      // to get team details and setPaymentStatus
      const response = await fetch(`/api/payment?teamid=${qrCodeMessage}`);
      const data = await response.json();
      setTeamData(data?.team);
      console.log(data.team);
      setPaymentStatus(data?.team?.payment);
      // to get and set timing details
      const timingsResponse = await fetch(`/api/event-times`);
      const timingsResponseData = await timingsResponse.json();
      setTimings(timingsResponseData);
      // to get eventDay details(can be null) and set EntryStatus and LunchStatus
      const eventDataResponse = await fetch(
        `/api/events/team-detail?teamid=${qrCodeMessage}`
      );
      const eventDataResponseData = await eventDataResponse?.json();
      setEventData(eventDataResponseData);
      setEntryStatus(eventDataResponseData?.attendance);
      setLunchStatus(eventDataResponseData?.lunch);
    }

    function onScanError(err) {
      console.warn(err);
    }
  }, []);

  const checkTime = (timingOf) => {
    for (let i = 0; i < timings.length; i++) {
      if (timings[i].name === timingOf) {
        const now = new Date();
        const startTime = new Date(timings[i].startTime);
        const endTime = new Date(timings[i].endTime);
        return now > startTime && now < endTime;
      }
    }
    return false;
  };

  const submitHandler = async () => {
    if (!eventData?.attendance) {
      if (!entryStatus) return alert("Please Verify Entry");
      await fetch("/api/events/team-detail/change-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, entryStatus }),
      });
    } else {
      if (!lunchStatus) return alert("Please Verify Lunch");
      await fetch("/api/events/team-detail/change-details", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, lunchStatus }),
      });
    }
    router.push("/dashboard/scan");
    // window.location.href = "http://localhost:3000/dashboard/scan";
  };

  return (
    <>
      <div className=" h-screen flex items-center justify-center">
        {detailsConfirmed ? (
          <>
            <div className="h-screen   flex justify-center flex-col gap-6">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  defaultChecked={eventData?.attendance}
                  className="w-8 h-8 accent-purple-600 rounded"
                  onChange={() => setEntryStatus((prev) => !prev)}
                />
                <label className="ml-8 font-extrabold text-3xl text-purple-600">
                  {eventData?.attendance ? (
                    <s className="text-gray-600">Entry</s>
                  ) : !checkTime("Attendance") ? (
                    <p className="text-gray-600">Entry</p>
                  ) : (
                    "Entry"
                  )}
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  defaultChecked={eventData?.lunch}
                  className="w-8 h-8 accent-purple-600 rounded"
                  onChange={() => setLunchStatus((prev) => !prev)}
                />
                <label className="ml-8 font-extrabold text-3xl text-purple-600">
                  {eventData?.lunch ? (
                    <s className="text-gray-600">Lunch</s>
                  ) : !checkTime("Lunch") ? (
                    <p className="text-gray-600">Lunch</p>
                  ) : (
                    "Lunch"
                  )}
                </label>
              </div>
              <button
                type="button"
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={submitHandler}
              >
                Verified and Submit
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
          </>
        ) : (
          <>
            {teamId ? (
              <>
                {teamData ? (
                  <div className="h-screen  flex items-center justify-center flex-col gap-5">
                    <Updates
                      payment={paymentStatus}
                      attendance={entryStatus}
                      first={eventData?.first}
                      lunch={lunchStatus}
                      second={eventData?.second}
                    />
                    <TeamDetails props={teamData} />
                    <button
                      type="button"
                      className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                      onClick={() => setDetailsConfirmed(true)}
                    >
                      Verified and Proceed
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
                ) : (
                  <>
                    <div className="text-center">
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div id="reader" className="md:w-1/2 w-full"></div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Scanner;
