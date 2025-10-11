import { Button } from "react-admin";
import { accessToken, BASE_URL } from "../../../constants";
import axios, { AxiosError } from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaInfoCircle } from "react-icons/fa";

const errorNotify = (msg: string) => {
    toast.error(msg, {
        position: 'bottom-right',
        autoClose: 2000,
    });
};

const successNotify = (msg: string) => {
    toast.success(msg, {
        position: 'bottom-right',
        autoClose: 2000,
    });
};

export default function Settings() {
    const handleRandomAllocate = async () => {
        const confirmResult = confirm("Are you sure you want to allocate randomly?");
        if (!confirmResult) {
            return;
        }
        console.log(accessToken)
        const response = await axios.patch(`${BASE_URL}/admin/allocate/random`, {}, {
            headers: {
                'Authorization': accessToken // Bearer is commonly used for tokens
            }
        });

        console.log(response.data);
        if (response.status === 200) {
            successNotify("Random Allocation Successful");
        } else {
            errorNotify("Error in Random Allocation");
        }
    };

    const handlePublishResults = async () => {
        const maxStudents = localStorage.getItem("maxStudents");
        const minStudents = localStorage.getItem("minStudents");
        const confirmResult = confirm(`Are you sure you want to publish the result with max students ${maxStudents} and min students ${minStudents}`);
        console.log("confirmResult", confirmResult);
        if (!confirmResult) {
            console.log("Not confirmed");
            return;
        }
        else {
            console.log("Confirmed");
            console.log(accessToken);
            try {
                const response = await axios.patch(
                    `${BASE_URL}/admin/allocate/confirm?max=${maxStudents}&min=${minStudents}`,
                    {},
                    {
                        headers: {
                            'Authorization': accessToken
                        }
                    }
                );


                console.log("Resp", response.data);
                const data = response.data;
                if (response.status === 200) {
                    successNotify("Result Published Successfully");
                } else {
                    errorNotify("Error in Publishing Result");
                }
            }
            catch (err) {
                const axiosError = err as AxiosError;
                const data: any = axiosError.response?.data;
                console.log("Data", data.message);
                errorNotify(data.message);
            }
        }
    }

    const minStudents = localStorage.getItem("minStudents");
    const maxStudents = localStorage.getItem("maxStudents");

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "10px",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                
            }}
        >
            <button
                    // className="bg-red-700 text-white rounded-md p-1 mt-2 px-3"
                    style={{
                        cursor: "pointer",
                        backgroundColor: "#dc2626",
                        color: "#fff",
                        padding: "5px",
                        borderRadius: "5px",
                        margin: "10px 10px",
                    }}
                    onClick={handleRandomAllocate}
                >
                    Random Allocate
                </button>
            <div style={{
                width: "50%",
                display: "flex",
                backgroundColor: "#f3f4f6",
                flexDirection: "column",
                gap: "10px",
                borderRadius: "10px",
                
            }}>
                <div style={{
                    maxWidth: "100%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: "10px",
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        height: "100%",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        paddingTop: "20px",
                    }}>
                        <FaInfoCircle size={25} style={{ color: "orange", marginLeft: 10 }} />
                    </div>
                    <div style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        margin: "0 10px",
                    }}>
                        <p
                            style={{
                                margin: "20px 0 10px",
                            }}
                        >Are you sure you want to publish the results? Once published, the results cannot be changed.</p>

                        <p
                            style={{
                                margin: "0",
                            }}
                        >
                            maximum students for each course: <span style={{color: "red", fontWeight: "bold"}}>{maxStudents}</span>

                        </p>
                        <p
                            style={{
                                margin: "0",
                            }}
                        >

                            minimum students for each course: <span style={{color: "red", fontWeight: "bold"}}>{minStudents}</span>
                        </p>

                        <p
                            style={{
                                margin: "10px 0 0",
                                color: "red",
                                fontWeight: "500",
                            }}
                        >

                            please note that the following action is irreversible
                        </p>
                    </div>
                </div>
                <div style={{
                    maxWidth: "100%",
                    flexDirection: "row",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    margin: "10px",
                }}>
                    <Button
                        fullWidth
                        style={{
                            padding: "10px 0",
                        }}
                        variant="contained"
                        label="Publish Results"
                        onClick={handlePublishResults}
                    />
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}