import express from "express";
import { MongoClient } from "mongodb";
import User from "../models/user.js";
import "dotenv/config.js";
import requireAuth from "../middleware/requireAuth.js";
import {
  registerUser,
  loginUser,
  updateUsername,
  updatePassword,
  verifyEmail,
  findUser,
} from "../middleware/userController.js";

const router = express.Router();

//Test for server status at this url
//The initial await client..... to the response status is AI generated code
router.get("/health", async (req, res) => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.db(process.env.MONGODB_DB).command({ ping: 1 });
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Error occurred while checking server status:", error);
    res.status(500).json({ status: "error" });
  }
});

// Returns the logged-in user's info (used by the frontend to check the token is still valid)
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username email");
    if (!user)
      return res.status(401).json({ message: "User no longer exists." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/find/:userId", findUser);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verify-email", verifyEmail);

router.put("/update-username", updateUsername);

router.put("/update-password", updatePassword);

export default router;
