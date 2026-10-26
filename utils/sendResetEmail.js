import createMailTransporter from "./createMailTransporter.js";

const sendResetEmail = (user, token) => {
  const transporter = createMailTransporter();

  const resetURL = `${process.env.CLIENT_URL}/passwords/resetpassword?id=${user._id}&token=${token}`;

  const mailOptions = {
    from: '"Gym Nutrition Calculator" <gymnutrition01@gmail.com>',
    to: user.email,
    subject: "[Gym Nutrition Calculator] Password Reset Link",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Reset Password Email Sent!", info.response);
    }
  });
};

export default sendResetEmail;
