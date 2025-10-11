// src/components/Screens/AllotmentDetails/CourseWise/StudentsByCourse.js
import React from "react";
import { useParams } from "react-router-dom";
import { Button, DatagridConfigurable, List, SelectColumnsButton, TextField, TopToolbar } from "react-admin";
import axios from "axios";
import { accessToken, BASE_URL } from "../../../../constants";
import { FaDownload } from "react-icons/fa";
import { saveAs } from 'file-saver';


interface StudentsByCourseListActionsProps {
  minorId: string | undefined;
  minorName: string;
}

const StudentsByCourseListActions: React.FC<StudentsByCourseListActionsProps> = ({ minorId, minorName }) => {

  const minStudents = localStorage.getItem("minStudents");
  const maxStudents = localStorage.getItem("maxStudents");

  return (
    <TopToolbar>
      <SelectColumnsButton />
      <Button startIcon={<FaDownload />}
        label="Download"
        onClick={async () => {
          const resp = await axios.get(`${BASE_URL}/admin/allocate/minor/${minorId}/download?min=${minStudents}&max=${maxStudents}`, {
            headers: {
              'Authorization': accessToken
            }
          })

          const blob = new Blob([resp.data], { type: 'text/csv;charset=utf-8;' });

          saveAs(blob, `${minorName}.csv`);

            console.log("File downloaded successfully.");
            console.log(resp);
        }}
      />
    </TopToolbar>
  )
}

const StudentsByCourse = (props: any) => {
  const { id } = useParams();
  const [minorName, setMinorName] = React.useState("");
  const fetchMinorDetails = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/minors/minor/${id}`);
      const data = resp.data;
      setMinorName(data.name);
    } catch (e) {
      console.log(e);
    }
  }


  React.useEffect(() => {
    fetchMinorDetails();
  }, [id]);



  return (
    <List
      {...props}
      filter={{ courseId: id }}
      title={`${minorName}`}
      resource="coursewise"
      actions={<StudentsByCourseListActions 
        minorName={minorName}
        minorId={id}
      />}
      pagination={false}
    >
      <DatagridConfigurable
        rowClick=""
      >
        <TextField source="rank" emptyText="N/A" />
        <TextField source="student.name" emptyText="N/A" />
        <TextField source="student.programName" emptyText="N/A" />
        <TextField source="student.regNo" emptyText="N/A" />
        <TextField source="student.sectionBatchName" emptyText="N/A" />
        <TextField source="student.cgpa" emptyText="N/A" />
      </DatagridConfigurable>
    </List>
  );
};

export default StudentsByCourse;
