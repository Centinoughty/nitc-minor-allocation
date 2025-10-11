import Navbar from "@/components/Navbar";
import SignIn from "@/components/SignIn";
import React, { useState } from "react";
import { useRouter } from "next/router";
// import { useDispatch } from "react-redux";
// import { setUserId } from "../state";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const router = useRouter();

  const failureNotify = () =>
    toast.error("User not found", { // Use toast.error for better clarity
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  React.useEffect(() => {
    const isUserLoggedIn = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        router.push("/courses");
      }
    };

    // Check for the 'failed' query parameter
    const isFailed = router.query.failed;
    if (isFailed) {
      console.error("Login failed");
      failureNotify(); // Show notification immediately
    }

    isUserLoggedIn();
  }, []);

  return (
    <div
      className={`bg-[#1A202C] text-center items-center flex flex-col min-h-screen justify-center text-white`}
    >
      <div className="bg-[#2E3748] w-11/12 shadow-2xl rounded-xl md:1/3 lg:w-1/3 xl:1/3 2xl:1/3 h-64 flex items-center justify-center flex-col gap-4">
        <div className="bg-white w-16 h-16 rounded-full justify-center items-center flex">
          <Image
            src="/LogoBW.png"
            width={50}
            height={50}
            className="p-2"
            alt=""
          />
        </div>
        <p>NITC MINOR ALLOCATION PORTAL</p>
        <SignIn />
      </div>
      <ToastContainer />
    </div>
  );
}
