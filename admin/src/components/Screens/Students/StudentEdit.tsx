import { BooleanInput, DatagridConfigurable, DateField, EmailField, TextField } from "react-admin";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit, SimpleForm, TextInput } from "react-admin";


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


export default function StudentEdit(props: any) {

    return (
        <div>
            <Edit title='Edit Student' {...props}>
                <SimpleForm>
                    <TextInput source="name" />
                    <TextInput source="regNo" />
                    <TextInput source="programName" />
                    <TextInput source="semester" />
                    <TextInput source="sectionBatchName" />
                    <TextInput source="cgpa" label="CGPA" />
                    <TextInput source="sgpaS1" label="SGPA S1" />
                    <TextInput source="sgpaS2" label="SGPA S2" />
                    <BooleanInput source="isVerified" />
                </SimpleForm>
            </Edit>
            <ToastContainer />
        </div>
    );
}