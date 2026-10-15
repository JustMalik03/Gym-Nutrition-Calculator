import User from "../models/user.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";

const createToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET;
  // Store the id as "id"
  return jsonwebtoken.sign({ id }, jwtSecret, { expiresIn: "3d" });
};


const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Check first before querying the database to avoid unnecessary queries
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
  
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const registerUser = new User({
      username,
      email,
      hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
    });

  

    await registerUser.save();

    sendVerificationEmail(registerUser);

    const token = createToken(registerUser.id);

    // Same shape as login: { token, user } - the frontend calls login(result.token, result.user)
    res.status(201).json({
      token,
      user: {
        username: registerUser.username,
        email: registerUser.email,
        isVerified: registerUser.isVerified,
      },
      message: "User has successfully registered",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verify user existence
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist." });

    // Verify password matching
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    // Generate Verification JWT Token
    const token = createToken(user.id)

    // Same user object shape as signup, so the frontend handles both the same way
    res.status(200).json({
      token,
      user: { username: user.username, email: user.email, isVerified: user.isVerified },
      message: "Login successful!",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.body.emailToken;

    if (!emailToken)
      return res.status(404).json({ message: "Email token not found" });

    const user = await User.findOne({ emailToken });

    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      await user.save();

      const token = createToken(user.id);
      // Same { token, user } shape as login, so the page can just call login() with it
      res.status(200).json({
        token,
        user: { username: user.username, email: user.email, isVerified: user.isVerified },
      });

    } else {
      res
        .status(404)
        .json({ message: "Email verification failed, invalid token" });
    }
  } catch (err) {
        res.status(500).json({ message: err.message });
  }
};

const updateUsername = async (req, res) => {
  try {
    const { newUsername, email } = req.body;
    const updateUser = await User.findOneAndUpdate(
      { email: email },
      { username: newUsername },
      { returnDocument: "after" },
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Username updated successfully", updateUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { newPassword, email } = req.body;

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const updateUser = await User.findOneAndUpdate(
      { email: email },
      { hashedPassword: newHashedPassword },
      { returnDocument: "after" },
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Password updated successfully", updateUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export {
  verifyEmail,
  registerUser,
  loginUser,
  updateUsername,
  updatePassword,
  findUser,
};
