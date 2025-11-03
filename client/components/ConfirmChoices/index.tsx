import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "@/AppConstants";
import PreferenceCard from "../Cards/ChoicesCard";

interface ConfirmPreferencesProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  selectedCourses: any[];
  onConfirmed?: () => void; // Callback to notify parent component
}

export default function ConfirmPreferences({
  loading,
  setLoading,
  selectedCourses,
  onConfirmed,
}: ConfirmPreferencesProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  // ✅ Toast for success confirmation
  const confirmNotify = () =>
    toast.success("Preferences Confirmed!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  // ❌ Toast for errors
  const declineNotify = (msg: string) =>
    toast.error(msg, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleConfirm = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.patch(
        `${BASE_URL}/students/student/choices`,
        {
          choices: selectedCourses.map((course) => course._id),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Response:", response);

      if (response.status === 200 && response.data) {
        setLoading(false);
        setTimeout(() => confirmNotify(), 300);
        setIsConfirmed(true);

        // ✅ Trigger parent callback and extra success toast
        if (onConfirmed) {
          onConfirmed();
          toast.success("Preferences saved successfully!", {
            autoClose: 2000,
          });
        }
      } else {
        console.log("Failed to confirm preferences");
        alert("Failed to confirm preferences");
        setLoading(false);
        setTimeout(() => declineNotify("Failed to confirm Preferences!"), 300);
        setIsConfirmed(false);
      }
    } catch (error: any) {
      console.error(error);
      setLoading(false);

      const errMsg =
        error?.response?.data?.message || "An unexpected error occurred.";
      setTimeout(() => declineNotify(errMsg), 300);

      setIsConfirmed(false);
    }
  };

  return (
    <>
      <div className="min-h-full h-96 w-10/12 lg:w-1/3 xl:w-1/3 md:w-1/3 2xl:w-1/3 dark:bg-[#1F2937] bg-[#A4B8FF] flex flex-col">
        {/* Course list */}
        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col gap-4 my-5">
            {selectedCourses.map((course, index) => (
              <PreferenceCard index={index} key={index} course={course} />
            ))}
          </div>
        </div>

        {/* Confirm button */}
        <div className="w-full">
          <button
            disabled={isConfirmed || loading}
            className={`w-full py-3 flex justify-center items-center font-bold text-white ${
              isConfirmed
                ? "bg-green-600"
                : "bg-[#4E7396] hover:bg-[#3b5a7a] transition"
            }`}
            onClick={handleConfirm}
          >
            {loading ? (
              <LoadingSpinner />
            ) : isConfirmed ? (
              "Confirmed"
            ) : (
              "Confirm Preferences"
            )}
          </button>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
