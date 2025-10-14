import React from 'react';
import { useState } from 'react';
// import 'react-datetime-picker/dist/DateTimePicker.css';
// import 'react-calendar/dist/Calendar.css';
// import 'react-clock/dist/Clock.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';
// import { BASE_URL } from '@/constants/AppConstants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { BASE_URL } from '../../../constants';

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];
// interface Dates {
//     verificationStartDate: ValuePiece;
//     verificationEndDate: ValuePiece;
//     choiceFillingStartDate: ValuePiece;
//     choiceFillingEndDate: ValuePiece;
// }

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


export default function Timeline() {
    const [dates, setDates] = useState<any>({
        verificationStartDate: null,
        verificationEndDate: null,
        choiceFillingStartDate: null,
        choiceFillingEndDate: null,
    });

    const [loading, setLoading] = useState({
        resetLoading: false,
        submitLoading: false,
    });

    const submitDetails = async () => {
        if (!dates.verificationStartDate || !dates.verificationEndDate || !dates.choiceFillingStartDate || !dates.choiceFillingEndDate) {
            errorNotify("Please fill all the fields");
            return;
        }
        const newDates = {
            startDate: dates.verificationStartDate.toISOString(),
            verificationEndDate: dates.verificationEndDate.toISOString(),
            choicefillingStartDate: dates.choiceFillingStartDate.toISOString(),
            choicefillingEndDate: dates.choiceFillingEndDate.toISOString(),
        };
        try {
            setLoading((prev) => ({ ...prev, submitLoading: true }));
            const response = await fetch(`${BASE_URL}/admin/timeline`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                    body: JSON.stringify(newDates),
                });

            const result = await response.json();
            console.log(result);
            console.log(response);
            if (response.status === 403) {
                errorNotify(result.message);
            }
            else if (response.status === 201) {
                successNotify("Timeline created successfully");
            }
            else {
                errorNotify("Error in creating timeline");
            }
        } catch (error) {
            console.log(error);
            errorNotify("Error in creating timeline");
        } finally {
            setLoading((prev) => ({ ...prev, submitLoading: false }));
        }
    }

    const resetHandler = async () => {
        setLoading((prev) => ({ ...prev, resetLoading: true }));
        try {
            const response = await axios.delete(`${BASE_URL}/admin/timeline`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            console.log(response);
            if (response.status === 200) {
                successNotify(response.data.message);
            }
        } catch (error) {
            console.log(error);
            errorNotify("Error in resetting timeline");
        } finally {
            setLoading((prev) => ({ ...prev, resetLoading: false }));
        }
    }


    React.useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/timeline`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    }
                });
                if (response.status === 200) {
                    const data = response.data;
                    console.log(data);
                    setDates({
                        verificationStartDate: dayjs(data.startDate),
                        verificationEndDate: dayjs(data.verificationEndDate),
                        choiceFillingStartDate: dayjs(data.choicefillingStartDate),
                        choiceFillingEndDate: dayjs(data.choicefillingEndDate),
                    });
                }
            } catch (error) {
                console.log(error);
                errorNotify("Error in fetching timeline");
            }
        }
        fetchTimeline();
    }, []);


    return (
        <div style={{
            minHeight: '70vh',
            overflow: 'hidden',
        }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    minHeight: '70vh',
                    overflow: 'hidden',
                }}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                }}>
                    <p
                        style={{
                            fontSize: '15px',
                            width: '50%',
                            fontWeight: 'bold',
                            maxWidth: '250px',
                            height: '100%',
                        }} className="font-bold">Verification</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            value={dates.verificationStartDate}
                            onChange={(newValue) => setDates({ ...dates, verificationStartDate: newValue })}
                            format='DD/MM/YYYY hh:mm a'
                        />
                    </LocalizationProvider>
                    <p
                        style={{
                            fontSize: '15px',
                            width: '10%',
                            fontWeight: 'bold',  
                        }}
                    >to</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            value={dates.verificationEndDate}
                            onChange={(newValue) => setDates({ ...dates, verificationEndDate: newValue })}
                            format='DD/MM/YYYY hh:mm a'
                        />
                    </LocalizationProvider>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                }}>
                    <p style={{
                        fontSize: '15px',
                        width: '50%',
                        fontWeight: 'bold',
                        height: '100%',
                    }}>Choice Filling</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            value={dates.choiceFillingStartDate}
                            onChange={(newValue) => setDates({ ...dates, choiceFillingStartDate: newValue })}
                            format='DD/MM/YYYY hh:mm a'
                        />
                    </LocalizationProvider>
                    <p style={{
                        fontSize: '15px',
                        width: '10%',
                        fontWeight: 'bold',
                    }}>to</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            value={dates.choiceFillingEndDate}
                            onChange={(newValue) => setDates({ ...dates, choiceFillingEndDate: newValue })}
                            format='DD/MM/YYYY hh:mm a'
                        />
                    </LocalizationProvider>
                </div>
                <div
                    style={{
                        marginTop: '30px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >
                    <button
                        style={{
                            backgroundColor: 'darkRed',
                            width: '100px',
                            color: 'white',
                            paddingLeft: '15px',
                            paddingRight: '15px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '5px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            padding: '10px',
                        }}
                        onClick={resetHandler}
                    >
                        {
                            loading.resetLoading ? <div>Loading...</div> : "Reset"
                        }
                    </button>
                    <button
                        onClick={submitDetails}
                        style={{
                            width: '100px',
                            backgroundColor: '#1E293B',
                            color: 'white',
                            paddingLeft: '15px',
                            paddingRight: '15px',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                            borderRadius: '5px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            padding: '10px',
                        }}
                    >
                        {
                            loading.submitLoading ? <div>Loading...</div> : "Submit"
                        }
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
