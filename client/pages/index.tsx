import Navbar from "@/components/Navbar";
import SignIn from "@/components/SignIn";
import React, { useState } from "react";
import { useRouter } from "next/router";
// import { useDispatch } from "react-redux";
// import { setUserId } from "../state";
import Dashboard from "./dashboard/index"
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
    const handleAuthStatus = async () => {
      const { failed, userId } = router.query;

      // If login failed, show toast
      if (failed) {
        console.error("Login failed");
        failureNotify();
      }

      // If successful login (backend redirected with ?userId=XYZ)
      if (userId) {
        localStorage.setItem("userId", userId as string);
        router.push("/dashboard");
        return;
      }

      // If already logged in, redirect to dashboard
      const existingUser = localStorage.getItem("userId");
      if (existingUser) {
        router.push("/dashboard");
      }
    };

    if (router.isReady) handleAuthStatus();
  }, [router.isReady, router.query]);

  return (
    // <div
    //   className={`bg-[#1A202C] text-center items-center flex flex-col min-h-screen justify-center text-white`}
    // >
    //   <div className="bg-[#2E3748] w-11/12 shadow-2xl rounded-xl md:1/3 lg:w-1/3 xl:1/3 2xl:1/3 h-64 flex items-center justify-center flex-col gap-4">
    //     <div className="bg-white w-16 h-16 rounded-full justify-center items-center flex">
    //       <Image
    //         src="/LogoBW.png"
    //         width={50}
    //         height={50}
    //         className="p-2"
    //         alt=""
    //       />
    //     </div>
    //     <p>NITC MINOR ALLOCATION PORTAL</p>
    //     <SignIn />
    //   </div>
    //   <ToastContainer />
    // </div>
    <Dashboard/>
  );
}
