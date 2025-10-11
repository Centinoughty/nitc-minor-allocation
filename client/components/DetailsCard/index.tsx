import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import Fields from "./Fields";
import React from "react";
// import { loggedInUser } from "@/AppConstants";
import { FaBug } from "react-icons/fa";

interface DetailsCardProps {
  handleConfirm: () => void;
  studentData: any;
  verified: boolean;
}

export default function DetailsCard({
  handleConfirm,
  studentData,
  verified,
}: DetailsCardProps) {
  const [fields, setFields] = React.useState([
    { label: "Name", value: "" },
    { label: "Roll No", value: "" },
    { label: "Faculty Advisor", value: "" },
    { label: "Email", value: "" },
    { label: "Department", value: "" },
    { label: "Semester", value: "" },
    { label: "Overall CGPA", value: "" },
    { label: "SGPA 1", value: "" },
    { label: "SGPA 2", value: "" },
  ]);

  const handleReport = async () => {
    const subject = encodeURIComponent(
      `Issue with student details for ${studentData.name}`
    );
    const body = encodeURIComponent(
      `Hello,\n\nI would like to report an issue with the following student details:\n\n` +
        `Name: ${studentData.name}\n` +
        `Roll No: ${studentData.regNo}\n` +
        `Faculty Advisor: ${studentData.faName}\n` +
        `Email: ${studentData.email}\n` +
        `Department: ${studentData.programName}\n` +
        `Semester: ${studentData.semester}\n` +
        `Overall CGPA: ${studentData.cgpa}\n` +
        `SGPA 1: ${studentData.sgpaS1}\n` +
        `SGPA 2: ${studentData.sgpaS2}\n\n` +
        `[Enter your issue below]`
    );
    const recipient = "minors@nitc.ac.in"; // Change to your relevant email

    // Opens user's default email client in new tab
    window.open(`mailto:${recipient}?subject=${subject}&body=${body}`);
  };

  React.useEffect(() => {
    setFields([
      { label: "Name", value: studentData.name },
      { label: "Roll No", value: studentData.regNo },
      { label: "Faculty Advisor", value: studentData.faName },
      { label: "Email", value: studentData.email },
      { label: "Department", value: studentData.programName },
      { label: "Semester", value: studentData.semester },
      { label: "Overall CGPA", value: studentData.cgpa },
      { label: "SGPA 1", value: studentData.sgpaS1 },
      { label: "SGPA 2", value: studentData.sgpaS2 },
    ]);
  }, [studentData]);

  if (studentData === null) {
    return;
  }

  return (
    <div className="dark:bg-[#1F2937] bg-[#D4DDFF] h-full lg:h-80 xl:h-80 2xl:h-80 3xl:h-80 sm:px-20 px-10 flex flex-col rounded-lg text-white shadow-lg w-11/12 lg:w-[60rem] xl:w-[60rem] 2xl:w-[60rem] 3xl:w-[60rem]">
      <>
        <div className="flex justify-between items-start h-full mt-5 flex-col lg:flex-row xl:flex-row 2xl:flex-row 3xl:flex-row">
          <div className="justify-around items-start flex h-full flex-col">
            {fields.slice(0, 3).map((field, index) => (
              <Fields key={index} label={field.label} value={field.value} />
            ))}
          </div>
          <div className="justify-around items-start flex h-full flex-col">
            {fields.slice(3, 6).map((field, index) => (
              <Fields key={index} label={field.label} value={field.value} />
            ))}
          </div>
          <div className="justify-around items-start flex h-full flex-col">
            {fields.slice(6, 9).map((field, index) => (
              <Fields key={index} label={field.label} value={field.value} />
            ))}
          </div>
        </div>
        <div className="w-full items-center justify-center mt-5 flex gap-4">
          <button
            className={`px-4 py-2 mb-5 text-center flex items-center justify-center rounded-md 
     bg-gray-100 dark:bg-gray-700
     text-black dark:text-white
     hover:bg-gray-400 dark:hover:bg-gray-600
     disabled:bg-gray-400 dark:disabled:bg-gray-800`}
            onClick={handleReport}
          >
            <FaBug className="text-black dark:text-white size-4 mr-1" /> Report
          </button>

          <button
            disabled={verified}
            className={
              `${
                verified
                  ? "bg-gray-300 dark:bg-gray-600"
                  : "bg-[#4E7396] dark:bg-[#3B5B75]"
              } ` +
              "px-5 py-2 mb-5 w-24 text-center flex items-center justify-center rounded-md " +
              `${
                verified
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-white dark:text-white"
              } ` +
              `${
                verified
                  ? "cursor-not-allowed"
                  : "hover:bg-blue-600 dark:hover:bg-blue-500"
              }`
            }
            onClick={handleConfirm}
          >
            {verified ? "Confirmed" : "Confirm"}
          </button>
        </div>
      </>
    </div>
  );
}
