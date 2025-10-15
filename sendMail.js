// sendMail.js

const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load Ghost's mail config
const ghostConfig = require(path.join(
  "/home/ghostuser/ghost-cms/ghost-local/config.development.json"
)).mail;

// Create transporter using Ghost's SMTP settings
const transporter = nodemailer.createTransport({
  host: ghostConfig.options.host,
  port: ghostConfig.options.port,
  secure: ghostConfig.options.secure,
  auth: ghostConfig.options.auth,
});

app.post("/send", async (req, res) => {
  const { fname, lname, email, message } = req.body;

  const mailOptions = {
  from: `"${fname} ${lname}" <${email}>`,
  to: ghostConfig.options.auth.user,
  subject: `📩 New Contact Form Submission`,
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      <h2 style="color: #333; margin-bottom: 10px;">New Contact Form Submission</h2>
      <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
        Someone just submitted a message via your website’s contact form.
      </p>

      <table style="width:100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #333;">First Name:</td>
          <td style="padding: 8px; color: #555;">${fname}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 8px; font-weight: bold; color: #333;">Last Name:</td>
          <td style="padding: 8px; color: #555;">${lname}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; color: #333;">Email:</td>
          <td style="padding: 8px; color: #0073aa;">
            <a href="mailto:${email}" style="color:#0073aa; text-decoration:none;">${email}</a>
          </td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 8px; font-weight: bold; color: #333;">Message:</td>
          <td style="padding: 8px; color: #555;">${message}</td>
        </tr>
      </table>

      <p style="margin-top: 25px; font-size: 12px; color: #999; text-align: center;">
        — Sent automatically from your website contact form —
      </p>
    </div>
  </div>
  `
};


  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

app.listen(5000, () => console.log("✅ Mailer running on http://localhost:5000"));
