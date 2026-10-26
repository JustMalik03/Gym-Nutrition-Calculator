import User from "../models/user.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import sendResetEmail from "../utils/sendResetEmail.js";

const requestReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    const secret = process.env.JWT_SECRET + user.hashedPassword;

    const token = jsonwebtoken.sign(
      { id: user._id, email: user.email },
      secret,
      { expiresIn: "1h" },
    );

    sendResetEmail(user, token);

    res.status(200).json({ message: "Reset link sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, id, token } = req.body;

    const user = await User.findById(id);

    if (password !== confirmPassword)
      return res.status(300).json({ message: "Passwords must match" });

    const secret = process.env.JWT_SECRET + user.hashedPassword;
    const verify = jsonwebtoken.verify(token, secret);

    const encryptedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
      {_id: id},
      {hashedPassword: encryptedPassword},
      {returnDocument: "after"}
    )

    if(!updatedUser) return res.status(404).json({message: "User not found"});

    res.status(200).json({message: "Password updated successfully"});
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export { requestReset, resetPassword };
