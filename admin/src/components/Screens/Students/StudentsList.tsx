import React from "react";
import {
  BooleanField,
  DatagridConfigurable,
  DateField,
  EmailField,
  List,
  SearchInput,
  SelectColumnsButton,
  TextField,
  TopToolbar,
  Button,
} from "react-admin";
import axios from "axios";
import { saveAs } from "file-saver";
import { FaDownload, FaUpload } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../LoadingIndicator";
import { BASE_URL } from "../../../constants";
import { useMediaQuery, Theme } from "@mui/material";

// Filters for search
const StudentsFilters = [
  <SearchInput
    source="term"
    alwaysOn
    key="search"
    placeholder="Search by name or Reg No"
  />,
];

// Toast notifications
const errorNotify = (msg: string) =>
  toast.error(msg, { position: "bottom-right", autoClose: 2000 });
const successNotify = (msg: string) =>
  toast.success(msg, { position: "bottom-right", autoClose: 2000 });

// Action buttons
const StudentsListAction = ({
  setIsUploading,
  setIsUploadSuccess,
  type,
  isUploading,
}: any) => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const handleDownload = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/download/csv`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "EnrolledStudents.csv");
      successNotify("File downloaded successfully");
    } catch (error) {
      console.error(error);
      errorNotify("Error downloading CSV");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setIsUploading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/admin/upload/csv${type === "students" ? "" : "/minors"}`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );
      const result = await response.json();
      if (response.status === 201) {
        successNotify(result.message || "Upload successful");
        setIsUploadSuccess(true);
      } else {
        errorNotify(result.message || "Upload failed");
        setIsUploadSuccess(false);
      }
    } catch (error) {
      console.error(error);
      errorNotify("Error while uploading CSV");
      setIsUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    setIsUploadSuccess(null);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";
    fileInput.onchange = (event) => handleFileChange(event as any);
    fileInput.click();
  };

  return (
    <TopToolbar>
      <SelectColumnsButton />
      <Button label="Download" onClick={handleDownload} startIcon={<FaDownload />} />
      {isUploading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "1rem" }}>
          <LoadingSpinner />
        </div>
      ) : (
        <Button label="Upload" onClick={handleUploadClick} startIcon={<FaUpload />} />
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
        actions={
          <StudentsListAction
            setIsUploading={setIsUploading}
            setIsUploadSuccess={setIsUploadSuccess}
            type="students"
            isUploading={isUploading}
            isUploadSuccess={isUploadSuccess}
          />
        }
        perPage={25}
        pagination
        title="Students"
        sort={{ field: "regNo", order: "ASC" }}
        filterDefaultValues={{ term: "" }}
      >
        <DatagridConfigurable rowClick="edit">
          <TextField source="name" />
          <TextField source="regNo" />
          <DateField source="dateOfBirth" />
          <EmailField source="email" />
          <TextField source="programName" label="Program" />
          <TextField source="semester" />
          <TextField source="sectionBatchName" label="Section/Batch" />
          <TextField source="faName" label="Faculty Advisor" />
          <TextField source="faEmail" label="FA Email" />
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
