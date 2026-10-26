import express from "express";
import { MongoClient } from "mongodb";
import User from "../models/user.js";
import multer from "multer";
import path from "path";
import "dotenv/config.js";
import requireAuth from "../middleware/requireAuth.js";
import {
  registerUser,
  loginUser,
  updateUsername,
  updatePassword,
  verifyEmail,
  findUser,
  updateProfileImage,
} from "../middleware/userController.js";
import { createGymPlan, getGymPlan, getMyGymPlans } from "../middleware/gymPlanController.js";
import { requestReset, resetPassword } from "../middleware/authController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  const mimeType = allowedTypes.includes(file.mimetype);
  if (mimeType) {
    return cb(null, true);
  } else {
    return cb(
      new Error(
        "Incorrect file type. Only jpeg, png, and jpg formats are allowed.",
      ),
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {fileSize: 5 * 1024 * 1024},
  fileFilter: fileFilter
});

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
    const user = await User.findById(req.userId).select(
      "username email isVerified avatarURL createdAt id",
    );
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

router.post("/profile-upload/:userId", upload.single("avatar"), updateProfileImage);

router.post("/requestReset", requestReset);

router.post("/reset", resetPassword);

router.put("/update-username", updateUsername);

router.put("/update-password", updatePassword);



//STRICT ONLY REQUIRE AUTHENTICATED USERS BELOW THIS LINE

router.post("/gym-plan", requireAuth, createGymPlan);

router.get("/gym-plan/:id", requireAuth, getGymPlan);

router.get("/gym-plan", requireAuth, getMyGymPlans);



export default router;
