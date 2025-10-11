import React, { useEffect } from "react";
import {
    BooleanField,
    Button,
    DatagridConfigurable,
    DateField,
    EmailField,
    ExportButton,
    FunctionField,
    List,
    SearchInput,
    SelectColumnsButton,
    TextField,
    TopToolbar,
} from "react-admin";
import { FaDownload } from "react-icons/fa6";
import { accessToken, BASE_URL } from "../../../../constants";
import axios from "axios";
import { saveAs } from "file-saver";
import { FaCheck } from "react-icons/fa";

const StudentWiseFilters = [
    <SearchInput source="q" alwaysOn key={`search`} />,
];

const StudentWiseListActions = ({ minStudents, maxStudents }: any) => {

    return (
        <TopToolbar>
            <SelectColumnsButton />
            <Button
                label="Download"
                onClick={async (e) => {
                    try {
                        const response = await axios.get(
                            `${BASE_URL}/admin/allocate/students/download?max=${maxStudents}&min=${minStudents}`,
                            {
                                responseType: "blob",
                                headers: {
                                    'Authorization': accessToken,
                                }
                            }
                        );

                        const blob = new Blob([response.data], {
                            type: "text/csv;charset=utf-8;",
                        });
                        saveAs(blob, "StudentWiseList.csv");
                    } catch (error) {
                        console.log(error);
                    }
                }}
                startIcon={<FaDownload />}
            />
        </TopToolbar>
    );
};

export default function StudentWiseList(props: any) {

    const minStudents = localStorage.getItem("minStudents");
    const maxStudents = localStorage.getItem("maxStudents");

    return (
        <List
            {...props}
            filters={StudentWiseFilters}
            actions={
                <StudentWiseListActions
                    minStudents={minStudents}
                    maxStudents={maxStudents}
                />
            }
        >
            <DatagridConfigurable
                rowClick=""
            >
                <TextField source="rank" emptyText="N/A" />
                <TextField source="student.name" label="Name" emptyText="N/A" />
                <TextField source="student.regNo" label="Roll No" emptyText="N/A" />
                <EmailField source="student.email" label="Email" emptyText="N/A" />
                <TextField source="student.programName" label="Department" emptyText="N/A" />
                <TextField source="student.sectionBatchName" label="Section Batch" emptyText="N/A" />
                <TextField source="student.faName" label="FA Name" emptyText="N/A" />
                <TextField source="student.faEmail" label="FA Email" emptyText="N/A" />
                <TextField source="enrolledCourse.name" label="Enrolled Course" emptyText="N/A" />
                <TextField source="choiceNo" label="Choice No" emptyText="N/A" />
                <BooleanField source="student.isVerified" label="Is Verified" emptyText="N/A" />
            </DatagridConfigurable>
        </List>
    );
}
