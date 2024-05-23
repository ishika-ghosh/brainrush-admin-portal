"use client";
import ConfirmationModal from "@components/ConfirmationModal";
import Loader from "@components/Loader";
import QualifierInput from "@components/QualifierInput";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
function TeamDetails({ params }) {
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [attended, setAttended] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timings, setTimigs] = useState([]);
  const [eventId, setEventId] = useState("");
  const [reqBody, setReqBody] = useState(null);
  const [modalData, setModalData] = useState({
    team: "",
    event: "",
  });
  const [checkbox, setCheckbox] = useState(new Array(2).fill(false));
  const getTeamDetails = async () => {
    const { id } = params;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/teams/all/${id}`);
      const { data: attendence } = await axios.get(`/api/teams/${id}`);
      const { data: timeData } = await axios.get("/api/event-times");
      setLoading(false);
      if (!data) {
        router.push("/404");
      }
      setDetails(data);
      setAttended(attendence ? true : false);
      setCheckbox([data?.payment, false]);
      setTimigs(timeData);
    } catch (error) {
      console.log(error);
      router.push("/dashboard");
    }
  };
  const handleChange = (ind, req, eventName) => {
    setCheckbox(checkbox.map((item, i) => (i === ind ? !item : item)));
    setReqBody(req);
    const e = getEventId(timings, eventName);
    setEventId(e);
    setModalData({
      team: details?.teamName.toUpperCase(),
      event: eventName,
    });
  };
  const handleSubmit = async () => {
    try {
      const { data } = await axios.put(`/api/payment`, reqBody);
      console.log(data);
      if (!data) {
        router.push("/404");
      }
      if (!data?.success) {
        alert(data?.message);
        handleCancel();
        return;
      }
      setDetails(data?.teamData);
      handleCancel();
    } catch (error) {
      console.log(error);
      const {
        response: { data },
      } = error;
      alert(data.message);
      handleCancel();
    }
  };
  const handleCancel = () => {
    setCheckbox([details?.payment, false]);
    setReqBody(null);
    setModalData({ team: "", event: "" });
    setEventId(null);
  };
  useEffect(() => {
    getTeamDetails();
  }, []);
  return loading ? (
    <Loader />
  ) : (
    <div className="container my-10 mx-auto md:px-6">
      {eventId && (
        <ConfirmationModal
          modalData={modalData}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
        />
      )}
      <section className="mb-32 text-center lg:text-left">
        <h2 className="mb-12 text-xl font-bold">
          Meet the Team{" "}
          <u className="text-primary dark:text-primary-400">
            {details?.teamName.toUpperCase()}
          </u>
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:gap-x-12">
          <div className="mb-6 lg:mb-0">
            <div className="relative block rounded-lg p-6 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 w-auto">
              <div className="flex-row items-center lg:flex">
                <div className="w-full shrink-0 grow-0 basis-auto lg:w-5/12 lg:pr-6">
                  <img
                    src={details?.leader.image}
                    alt="Trendy Pants and Shoes"
                    className="mb-6 w-full rounded-md lg:mb-0"
                  />
                </div>
                <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
                  <h5 className="mb-2 text-lg font-bold">
                    {details?.leader.name}
                    <span className="bg-green-100 text-green-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                      Leader
                    </span>
                  </h5>
                  <p className="mb-4 text-neutral-500 dark:text-neutral-300">
                    {details?.leader.email}
                  </p>
                  <p className="mb-4 text-neutral-500 dark:text-neutral-300">
                    {details?.leader.department} {details?.leader.year}
                  </p>
                  <p className="mb-4 text-neutral-500 dark:text-neutral-300">
                    {details?.leader?.phoneNumber}
                  </p>
                  <ul className="mx-auto flex list-inside justify-center lg:justify-start"></ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 lg:mb-0">
            <div className="relative block rounded-lg p-6 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
              {details?.members.length > 0 ? (
                details?.members.map((member) => (
                  <div
                    className="flex-row items-center lg:flex mb-3"
                    key={member?._id}
                  >
                    <div className="w-full shrink-0 grow-0 basis-auto lg:w-5/12 lg:pr-6">
                      <img
                        src={member?.image}
                        alt="Trendy Pants and Shoes"
                        className="mb-6 w-full rounded-md lg:mb-0"
                      />
                    </div>
                    <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
                      <h5 className="mb-2 text-lg font-bold">{member?.name}</h5>
                      <p className="mb-4 text-neutral-500 dark:text-neutral-300">
                        {member?.email}
                      </p>
                      <p className="mb-4 text-neutral-500 dark:text-neutral-300">
                        {member.department} {member.year}
                      </p>
                      <p className="mb-4 text-neutral-500 dark:text-neutral-300">
                        {member?.phoneNumber}
                      </p>
                      <ul className="mx-auto flex list-inside justify-center lg:justify-start"></ul>
                    </div>
                  </div>
                ))
              ) : (
                <span>Team Not Completed</span>
              )}
            </div>
          </div>
        </div>
        <div className="my-10">
          <p>
            Payment Status:{" "}
            {details?.payment ? (
              <span className="bg-green-100 text-green-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                Completed
              </span>
            ) : (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md border border-purple-100 dark:bg-gray-700 dark:border-purple-500 dark:text-purple-400">
                Due
              </span>
            )}
          </p>
          <ul className="my-10 items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {details?.members.length === 2 && (
              <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                <QualifierInput
                  qualified={details?.payment}
                  isDisabled={
                    !details?.members.length === 2 ||
                    !checkTime(timings, "Payment")
                  }
                  isChecked={checkbox[0]}
                  handleChange={() => {
                    handleChange(
                      0,
                      {
                        teamId: details?._id,
                        paymentStatus: !details?.payment,
                      },
                      "Payment"
                    );
                  }}
                  cardTitle="Payment"
                />
              </li>
            )}
            {details?.payment && (
              <li className="w-full dark:border-gray-600">
                <QualifierInput
                  qualified={attended}
                  isDisabled={!checkTime(timings, "Attendence")}
                  isChecked={checkbox[1]}
                  handleChange={() => {
                    setCheckbox(
                      checkbox.map((item, i) => (i === 1 ? !item : item))
                    );
                    setLoading(true);
                    const { data: eventAttendence } = axios.post(
                      "/api/events/team-detail/change-details",
                      { teamId: details?._id, entryStatus: true }
                    );
                    if (eventAttendence?.success) {
                      setAttended(eventStarted);
                      router.push("/dashboard/teams");
                    } else {
                      router.push("/dashboard/teams");
                    }
                    setLoading(false);
                  }}
                  cardTitle={"Attendence"}
                />
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default TeamDetails;

const checkTime = (times, time) => {
  let flag = false;
  times?.forEach((ele) => {
    if (ele.name.toLowerCase() === time.toLowerCase()) {
      const today = new Date();

      flag = today >= new Date(ele.startTime) && today < new Date(ele.endTime);
    }
  });
  return flag;
};
const getEventId = (times, name) => {
  let id = "";
  times?.forEach((time) => {
    if (time.name.toLowerCase() === name.toLowerCase()) {
      id = time._id;
    }
  });
  return id;
};
