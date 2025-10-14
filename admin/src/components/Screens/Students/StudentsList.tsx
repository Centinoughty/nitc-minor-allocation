import React, { useEffect, useState } from "react";
import {
  BooleanField,
  DatagridConfigurable,
  DateField,
  EmailField,
  TextField,
  TopToolbar,
} from "react-admin";
import axios from "axios";
import { accessToken, BASE_URL } from "../../../constants";
import { saveAs } from "file-saver";
import { Button } from "react-admin";
import { FaDownload, FaUpload } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../../LoadingIndicator";

const errorNotify = (msg: string) => {
  toast.error(msg, {
    position: "bottom-right",
    autoClose: 2000,
  });
};

const successNotify = (msg: string) => {
  toast.success(msg, {
    position: "bottom-right",
    autoClose: 2000,
  });
};

const StudentsListAction = ({ setIsUploading, setIsUploadSuccess, type, isUploading }: any) => {
  const handleDownload = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/download/csv`, {
        responseType: "blob",
        headers: {
          "Content-Type": "text/csv;charset=utf-8;",
          Authorization: accessToken,
        },
      });

      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "EnrolledStudents.csv");
    } catch (error) {
      console.error("Error while downloading CSV:", error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setIsUploading(true);
      try {
        const response = await fetch(`${BASE_URL}/admin/upload/csv${type === "students" ? "" : "/minors"}`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: accessToken,
          },
        });
        const result = await response.json();
        if (response.status === 201) {
          successNotify(result.message);
          setIsUploadSuccess(true);
        } else {
          errorNotify(result.message);
          setIsUploadSuccess(false);
        }
      } catch (error) {
        console.error("Error:", error);
        errorNotify("Error while uploading the CSV file.");
        setIsUploadSuccess(false);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUploadClick = () => {
    setIsUploadSuccess(null);
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("accept", ".csv");
    fileInput.onchange = (event) => {
      handleFileChange(event as any);
    };
    fileInput.click();
  };

  return (
    <TopToolbar>
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

export default function StudentsList() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async (term = "") => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/admin/search`, {
        headers: { Authorization: accessToken },
        params: { term },
      });
      setStudents(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setStudents([]);
      } else {
        console.error(error);
        errorNotify("Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudents(searchTerm);
    }, 500); // debounce for 0.5s
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div>
      <StudentsListAction
        setIsUploading={() => {}}
        setIsUploadSuccess={() => {}}
        type="students"
        isUploading={false}
      />

      <div style={{ padding: "10px" }}>
        <input
          type="text"
          placeholder="Search by Name or Roll No"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "15px",
          }}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <DatagridConfigurable data={students} isRowSelectable={() => true} rowClick="edit">
          <TextField source="name" label="Name" />
          <TextField source="regNo" label="Reg No" />
          <DateField source="dateOfBirth" label="DOB" />
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
      )}

      <ToastContainer />
    </div>
  );
}
