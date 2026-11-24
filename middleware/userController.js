import User from "../models/user.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator";
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

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Bad password" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const registerUser = new User({
      username,
      email,
      hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
    });

    await registerUser.save();

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
    if (!user) return res.status(400).json({ message: "User does not exist" });

    // Verify password matching
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate Verification JWT Token
    const token = createToken(user.id);

    // Same user object shape as signup, so the frontend handles both the same way
    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        avatarURL: user.avatarURL,
        createdAt: user.createdAt,
        userId: user.id,
        bio: user.bio,
      },
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
        user: {
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          avatarURL: user.avatarURL,
        },
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

const updateProfile = async (req, res) => {
  try {
    const { newUsername, userBio, email } = req.body;

    const user = await User.findOne({ email });

    const userExists = await User.findOne({ newUsername });

    let noChanges = false;

    if(userExists && userExists.email === user.email) return res.status(300).json({ message: "Username has been taken" });

    if(user.username === newUsername && user.bio === userBio) noChanges = true;

    if (!user) return res.status(300).json({ message: "User does not exist" });

    if (/^[a-zA-Z0-9]{4,26}$/.test(newUsername)) user.username = newUsername;

    if (userBio.length < 500) user.bio = userBio;

    const updatedUser = await user.save();

    if(noChanges){
      res.status(200).json({ message: "No changes were made", updatedUser });
    } else {
      res.status(200).json({ message: "Profile updated successfully", updatedUser });
    }

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword, email } =
      req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);

    if (
      !validator.isStrongPassword(newPassword) ||
      newPassword === currentPassword
    )
      return res.status(300).json({ message: "Bad password request" });

    if (!isMatch) return res.status(300).json({ message: "Invalid password" });

    if (newPassword !== confirmNewPassword)
      return res.status(300).json({ message: "Passwords must match" });

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const updateUser = await User.findOneAndUpdate(
      { email: email },
      { hashedPassword: newHashedPassword },
      { returnDocument: "after" },
    );

    res
      .status(200)
      .json({ message: "Password updated successfully", updateUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file found" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { avatarURL: imagePath },
      { returnDocument: "after" },
    );

    res.status(200).json({
      message: "Profile successfully updated",
      user: updatedUser,
      filePath: imagePath,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateEmail = async (req, res) => {
  try {
    const { newEmail, verifyEmailPassword, userId } = req.body;

    const userExists = await User.findOne({ newEmail });

    if (userExists)
      return res.status(300).json({ message: "User already exists" });

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(
      verifyEmailPassword,
      user.hashedPassword,
    );

    if (!isMatch)
      return res.status(300).json({ message: "Invalid credentials" });

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          email: newEmail,
          emailToken: crypto.randomBytes(64).toString("hex"),
          isVerified: false,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    res
      .status(200)
      .json({ message: "Email updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(300).json({ message: "User does not exist" });

    sendVerificationEmail(user);

    res.status(200).json({ message: "Email has been sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  verifyEmail,
  registerUser,
  loginUser,
  updateProfile,
  updatePassword,
  findUser,
  updateProfileImage,
  updateEmail,
  sendEmail,
};
