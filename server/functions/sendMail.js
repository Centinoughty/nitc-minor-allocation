import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = async (toEmail, subject, body) => {
  await transporter.sendMail({
    from: "Minors NITC <minors@nitc.ac.in>",
    to: toEmail,
    subject: subject,
    text: `${body}\n\nThis is a system generated email. Please do not reply to this email.`,
  });

  console.log("Mail sent to " + toEmail);
};
