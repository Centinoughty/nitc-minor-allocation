import React from "react";
import { BooleanField, Datagrid, DatagridConfigurable, DateField, EmailField, List, SearchInput, SelectColumnsButton, TextField, TopToolbar } from "react-admin";
import axios from "axios";
import { accessToken, BASE_URL } from "../../../constants";
import { saveAs } from 'file-saver';
import { Button } from "react-admin";
import { FaDownload, FaUpload } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from "../../LoadingIndicator";

const StudentsFilters = [
    <SearchInput source="q" alwaysOn key={`search`} />,
];

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

const StudentsListAction = ({ setIsUploading, setIsUploadSuccess, type, isUploading }: any) => {
    const handleDownload = async () => {
        try {
            console.log("Downloading...");

            const response = await axios.get(`${BASE_URL}/admin/download/csv`, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'text/csv;charset=utf-8;',
                    'Authorization': accessToken,
                }
            });

            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });

            saveAs(blob, 'EnrolledStudents.csv');

            console.log("File downloaded successfully.");
        } catch (error) {
            console.error("Error while downloading the CSV file:", error);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            setIsUploading(true);
            try {
                const response = await fetch(`${BASE_URL}/admin/upload/csv${type === "students" ? "" : "/minors"}`,
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            'Authorization': accessToken,
                        }
                    }
                );
                const result = await response.json();
                if (response.status === 201) {
                    successNotify(result.message);
                    setIsUploadSuccess(true);
                } else {
                    errorNotify(result.message);
                    setIsUploadSuccess(false);
                }
            } catch (error) {
                console.error('Error:', error);
                errorNotify("Error while uploading the CSV file.");
                setIsUploadSuccess(false);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleUploadClick = () => {
        setIsUploadSuccess(null);
        const fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('accept', '.csv');
        fileInput.onchange = (event) => {
            handleFileChange(event as any);
        };
        fileInput.click();
    }

    return (
        <TopToolbar>
            <SelectColumnsButton />
            <Button
                label="Download"
                onClick={handleDownload}
                startIcon={<FaDownload />}
            />
            {isUploading ? <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: '1rem',
            }}><LoadingSpinner /></div> : (
                <Button
                    label="Upload"
                    onClick={handleUploadClick}
                    startIcon={<FaUpload />}
                />
            )}
        </TopToolbar>
    );
};

export default function StudentsList(props: any) {
    const [isUploadSuccess, setIsUploadSuccess] = React.useState<boolean | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);

    return (
        <div>
            <List
                {...props}
                filters={StudentsFilters}
                actions={<StudentsListAction
                    setIsUploading={setIsUploading}
                    setIsUploadSuccess={setIsUploadSuccess}
                    type="students"
                    isUploading={isUploading}
                    isUploadSuccess={isUploadSuccess}
                />}
            >
                <DatagridConfigurable
                    isRowSelectable={() => true}
                    rowClick="edit"
                >

                    <TextField source="name" />
                    <TextField source="regNo" />
                    <DateField source="dateOfBirth" />
                    <EmailField source="email" />
                    <TextField source="programName" />
                    <TextField source="semester" />
                    <TextField source="sectionBatchName" />
                    <TextField source="faName" />
                    <TextField source="faEmail" />
                    <TextField source="cgpa" label="CGPA" />
                    <TextField source="sgpaS1" label="SGPA S1" />
                    <TextField source="sgpaS2" label="SGPA S2" />
                    <BooleanField source="isVerified" label="Verified" />
                </DatagridConfigurable>
            </List>
            <ToastContainer />
        </div>
    );
}