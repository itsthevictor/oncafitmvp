const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/auth/reset-password?token=${token}&email=${email}`;
  const message = `<p>Please reset your password by clicking on the following link: <a href="${resetURL}">Reset password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4>
        ${message}`,
  });
};

module.exports = sendResetPasswordEmail;
