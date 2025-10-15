import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { db } from "../../DB/db";
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";
import CoursesCard from "@/components/Cards/CoursesCard";
import { useRouter } from "next/router";


export default function Courses() {
  const router = useRouter();
  const [coursesList, setCoursesList] = useState([
    {
      _id: "",
      name: "",
      faculty: "",
      facultyEmail: "",
      fileURL: "",
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchCoursesData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/fetchCoursesData");
      const data = response.data;
      setCoursesList(data);
      setIsLoading(false);
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      // router.replace("/");
      }
    }
  };

  React.useEffect(() => {
    fetchCoursesData();
    const userId = localStorage.getItem("userId");
    if (
      userId == null ||
      userId == undefined ||
      userId == "" ||
      userId.length == 0
    ) {
      // router.replace("/");
    }
  }, []);

  if (isLoading) {
    return (
      <div className={`dark:bg-[#1A202C]`}>
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className={`dark:bg-[#1A202C]`}>
      <Navbar />
      <div className="flex justify-center min-h-screen pb-10 mx-5">
        <div className="w-full max-w-2xl">
          <h1
            className={`text-3xl font-bold text-center mb-10 dark:text-white text-black mt-10`}
          >
            Courses
          </h1>
          <div className="grid grid-cols-1 gap-4">
            {coursesList.map((course) => (
              <CoursesCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
