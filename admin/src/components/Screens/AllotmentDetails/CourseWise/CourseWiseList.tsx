import React from "react";
import { DatagridConfigurable, FunctionField, List, SearchInput, SelectColumnsButton, TextField, TopToolbar } from "react-admin";

const StudentWiseFilters = [
    <SearchInput source="q" alwaysOn key={`search`} />,
]

const CourseWiseListActions = () => {
    return (
        <TopToolbar>
            <SelectColumnsButton />
        </TopToolbar>
    )
}

export default function CourseWiseList(props: any){
    return(
        <List
            {...props}
            filters={StudentWiseFilters}
            actions={<CourseWiseListActions />}
            pagination={false}
        >
            <DatagridConfigurable>
                <TextField source="course.name" emptyText="N/A"/>
                <TextField source="course.faculty" emptyText="N/A"/>
                <TextField source="course.facultyEmail" emptyText="N/A"/>
                <TextField source="enrolled" emptyText="N/A" label="Total Enrolled"/>
                <FunctionField
                    label="Dropped"
                    render={record => {
                        console.log(record);
                        return (
                            record.isDropped ? "Yes" : "No"
                        )
                    }}
                />
            </DatagridConfigurable>
        </List>
    )
}