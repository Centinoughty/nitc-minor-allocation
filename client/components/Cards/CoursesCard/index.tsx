import axios from "axios";
import React from "react";
import { LiaDownloadSolid } from "react-icons/lia";

interface CoursesCardProps {
  course: {
		_id: string;
    name: string;
    faculty: string;
    facultyEmail: string;
    fileURL: string;
  };
}

export default function CoursesCard({ course }: CoursesCardProps) {
  
	const handleClick = async () => {
		try {
			const response = await axios.get("/api/downloadMinorSyllabus", {
				params: {
					id: course._id
				},
				responseType: 'blob' // Ensure we get the response as a blob (binary)
			});
	
			// Create a download link for the PDF
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `${course.name}.pdf`);
			
			// Append the link to the body, click it, and remove it
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
	
		} catch (err) {
			console.log(err);
		}
	};
	
	return (
    <div
      className={`dark:bg-[#171A23] bg-[#D4DDFF] shadow p-4 rounded-lg flex justify-between`}
    >
      <div className="flex flex-col gap-2">
        <h2 className={`text-xl font-bold dark:text-white text-black`}>
          {course.name}
        </h2>
        <p className="text-sm text-gray-500">Faculty: {course.faculty}</p>
        <p className="text-sm text-gray-500">Email: {course.facultyEmail}</p>
      </div>
      <div className="flex flex-col align-center justify-center ">
        <button
          onClick={handleClick}
          className="bg-white dark:bg-gray-800 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <LiaDownloadSolid className="text-black dark:text-white size-6 " />
        </button>
      </div>
    </div>
  );
}
