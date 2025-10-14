import express from "express";
import {
  createStudentsFromCSV,
  getStudentById,
  getStudentChoices,
  getStudentResult,
  getStudents,
  setStudentVerification,
  updateStudentWithChoices,
} from "../controllers/students.js";
import { getStage } from "../controllers/settings.js";
import authToken from "../middlewares/authToken.js";
import { get } from "mongoose";
// import { getAppTimeline } from "../controllers/settings.js";

const router = express.Router();

// CREATE
router.post("/csv", createStudentsFromCSV);

// READ
router.get("/", authToken, getStudents);
router.get("/student", authToken, getStudentById);
router.get("/student/result", authToken, getStudentResult);
router.get("/timeline", getStage);
router.get("/student/choices", authToken, getStudentChoices);

// UPDATE
router.patch("/student/choices", authToken, updateStudentWithChoices);
router.patch("/student/verify", authToken, setStudentVerification);

export default router;
