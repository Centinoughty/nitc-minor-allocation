import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendMail = async (toEmail, subject) => {
  await transporter.sendMail({
    from: "Minors NITC <minors@nitc.ac.in>",
    to: toEmail,
    subject: subject,
    text: "This is a system generated email. Please do not reply to this email.",
  });

  console.log("Mail sent to " + toEmail);
};

sendMail("nadeemvadasseril@gmail.com", "Test Mail");
