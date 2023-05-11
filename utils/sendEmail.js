const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const nodemailerConfig = require("./nodemailerConfig");

// const sendEmail = async () => {
//   let testAccount = await nodemailer.createTestAccount();

//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     auth: {
//       user: "carli.wunsch90@ethereal.email",
//       pass: "8FjU8Mfd5yyY7msBtr",
//     },
//   });

//   let info = await transporter.sendMail({
//     from: '"The Onca 🐆" <hello@onca.studio>', // sender address
//     to: "victor.d.alexa@gmail.com",
//     subject: "verification email",
//     html: "<h1>Verifyyy</h1>",
//   });
// };

const sendEmail = async ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    from: "Onca Fit MVP <hello@onca.studio>",
    to,
    subject,
    html,
  };

  const info = await sgMail.send(msg);
};

module.exports = sendEmail;
