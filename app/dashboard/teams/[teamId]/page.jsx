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
  const [loading, setLoading] = useState(false);
  const [timings, setTimigs] = useState([]);
  const [eventId, setEventId] = useState("");
  const [reqBody, setReqBody] = useState(null);
  const [modalData, setModalData] = useState({
    team: "",
    event: "",
  });
  const [checkbox, setCheckbox] = useState(new Array(4).fill(false));
  const getTeamDetails = async () => {
    const { teamId } = params;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/teams/${teamId}`);
      setDetails(data);
      setCheckbox([data?.first, data?.second, data?.third, data?.lunch]);
      const { data: timeData } = await axios.get("/api/event-times");
      setLoading(false);
      if (!data) {
        router.push("/404");
      }
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
      team: details?.team?.teamName.toUpperCase(),
      event: eventName,
    });
  };
  const handleSubmit = async () => {
    try {
      const { teamId } = params;
      const { data } = await axios.put(
        `/api/teams/${teamId}?eventid=${eventId}`,
        reqBody
      );
      if (!data) {
        router.push("/404");
      }
      setDetails(data?.updatedEvent);
      if (!data?.success) {
        alert(
          "Due to some technical fault mail not send Kindly inform the team Some how"
        );
      }
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
    setCheckbox([
      details?.first,
      details?.second,
      details?.third,
      details?.lunch,
    ]);
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
            {details?.team?.teamName.toUpperCase()}
          </u>
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:gap-x-12">
          <div className="mb-6 lg:mb-0">
            <div className="relative block rounded-lg p-6 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 w-auto">
              <div className="flex-row items-center lg:flex">
                <div className="w-full shrink-0 grow-0 basis-auto lg:w-5/12 lg:pr-6">
                  <img
                    src={details?.team?.leader.image}
                    alt="Trendy Pants and Shoes"
                    className="mb-6 w-full rounded-md lg:mb-0"
                  />
                </div>
                <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
                  <h5 className="mb-2 text-lg font-bold">
                    {details?.team?.leader.name}
                    <span className="bg-green-100 text-green-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                      Leader
                    </span>
                  </h5>
                  <p className="mb-4 text-neutral-500 dark:text-neutral-300">
                    {details?.team?.leader.email}
                  </p>
                  <p className="mb-4 text-neutral-500 dark:text-neutral-300">
                    {details?.team?.leader.department}{" "}
                    {details?.team?.leader.year}
                  </p>
                  <p className="mb-4 text-neutral-500 dark:text-neutral-300">
                    {details?.team?.leader?.phoneNumber}
                  </p>
                  <ul className="mx-auto flex list-inside justify-center lg:justify-start"></ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6 lg:mb-0">
            <div className="relative block rounded-lg p-6 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
              {details?.team?.members.length > 0 ? (
                details?.team?.members.map((member) => (
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
            {details?.team?.payment ? (
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
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
              <QualifierInput
                qualified={details?.first}
                isDisabled={!checkTime(timings, "First Round")}
                isChecked={checkbox[0]}
                handleChange={() =>
                  handleChange(0, { first: !details?.first }, "First Round")
                }
                cardTitle="First Round"
              />
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
              <QualifierInput
                qualified={details?.second}
                isDisabled={!checkTime(timings, "2nd Round")}
                isChecked={checkbox[1]}
                handleChange={() =>
                  handleChange(1, { second: !details?.second }, "2nd Round")
                }
                cardTitle={"Second Round"}
              />
            </li>
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
              <QualifierInput
                qualified={details?.third}
                isDisabled={!checkTime(timings, "3rd Round")}
                isChecked={checkbox[2]}
                handleChange={() =>
                  handleChange(2, { third: !details?.third }, "3rd Round")
                }
                cardTitle={"Final Round"}
              />
            </li>
            <li className="w-full dark:border-gray-600">
              <QualifierInput
                qualified={details?.lunch}
                isDisabled={!checkTime(timings, "Lunch")}
                isChecked={checkbox[3]}
                handleChange={() =>
                  handleChange(3, { lunch: !details?.lunch }, "Lunch")
                }
                cardTitle={"Lunch"}
              />
            </li>
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
