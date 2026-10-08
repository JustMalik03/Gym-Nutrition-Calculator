import createMailTransporter from "./createMailTransporter.js";

const sendVerificationEmail = (user) => {
    const transporter = createMailTransporter();

    const mailOptions = {
        from: '"Gym Nutrition Calculator" <gymnutrition01@gmail.com>',
        to: user.email,
        subject: "[Gym Nutrition Calculator] Email verification link",
        html: `<p>Hello ${user.username}, verify your email by clicking this link...</p>
        <a href='${process.env.CLIENT_URL}/verify-email?emailToken=${user.emailToken}'>Verify Your Email</a>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err);
        } else {
            console.log("Verification Email Sent!", info.response)
        }
    })
}

export default sendVerificationEmail;