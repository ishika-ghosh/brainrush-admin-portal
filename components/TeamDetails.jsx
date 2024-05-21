import Image from "next/image";

const TeamDetails = ({ props }) => {
  return (
    <>
      <div className="flex items-center justify-center flex-col gap-5">
        <div className="bg-black w-64 text-white text-center rounded p-2">
          Team Details
        </div>
        <div className="text-4xl font-extrabold text-gray-900 underline dark:text-white decoration-blue-500">
          {props?.teamName}
        </div>

        <div className="flex items-center space-x-4 justify-start">
          <Image
            width={10}
            height={10}
            className="w-10 h-10 rounded-full"
            src={"https://robohash.org/harsh"}
            alt=""
          ></Image>
          <div className="font-medium dark:text-white">
            <div>{props?.leader?.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {props?.leader?.department}, {props?.leader?.year}
            </div>
          </div>
        </div>
        {props.members.map((member) => (
          <div className="flex items-center space-x-4">
            <Image
              width={10}
              height={10}
              className="w-10 h-10 rounded-full"
              src={`https://robohash.org/${member?.name}`}
              alt=""
            ></Image>
            <div className="font-medium dark:text-white">
              <div>{member ? member?.name : "Team Member"}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {member
                  ? member?.department + ", " + member?.year
                  : "Not selected"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TeamDetails;
