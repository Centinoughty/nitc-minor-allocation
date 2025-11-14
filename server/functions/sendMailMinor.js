/*
do this only choices array is not empty
if no course is enrolled, say you are not alloted in any course
if course is alloted, say you are alloted in course x
*/

import mongoose from "mongoose";
import dotenv from "dotenv";

import Student from "../models/Student.js";
import { sendMail } from "./sendMail.js";

dotenv.config();

const minors = {
  "6908b7d2c9d3b9cac5bcb9ec": "Unmanned Aerial Systems (UAS) and Technologies",
  "6908b7d2c9d3b9cac5bcb9eb": "Photonics and Optical Engineering",
  "6908b7d2c9d3b9cac5bcb9ea": "Computational and Systems Biology",
  "6908b7d2c9d3b9cac5bcb9e9": "Entrepreneurship & Business Analytics",
  "6908b7d2c9d3b9cac5bcb9e8": "Building Systems Engineering",
  "6908b7d2c9d3b9cac5bcb9e7": "Geoinformatics",
  "6908b7d2c9d3b9cac5bcb9e6": "Smart Mobility and Electric Vehicle Engineering",
  "6908b7d2c9d3b9cac5bcb9e5": "Robotics and Automation",
  "6908b7d2c9d3b9cac5bcb9e4": "Cyber Physical Systems",
  "6908b7d2c9d3b9cac5bcb9e3": "Alternative Energy Technology",
  "6908b7d2c9d3b9cac5bcb9e2": "Artificial Intelligence & Machine Learning",
};

const sendMailToStudents = async () => {
  await mongoose.connect(process.env.MONGO_URL);

  const students = await Student.find({ choices: { $ne: [] } });

  for (const student of students) {
    if (!student.enrolled) {
      await sendMail(
        student.email,
        "Minor Course Allotment Result",
        "Thank you for participating in the Minor Programme allotment process. We regret to inform you that you have not been allotted any Minor Programme based on the choices you submitted."
      );

      console.log("SENT --- NOT ALLOTTED --- ", student.email);
    } else {
      const minorName = minors[student.enrolled.toString()];

      await sendMail(
        student.email,
        "Minor Course Allotment Result",
        `Thank you for participating in the Minor Programme allotment process. We are pleased to inform you that you have been allotted the ${minorName} Minor Programme.`
      );
    }
  }

  console.log("All mails sent!");
};

await sendMailToStudents();
