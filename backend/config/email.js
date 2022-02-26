const nodemailer = require("nodemailer");

const sendEmail = async (email, link) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Password reset Link",
      text: `To reset your password click on the below link ${link}`,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error);
    throw new Error("Email not sent try again!");
  }
};

module.exports = sendEmail;
