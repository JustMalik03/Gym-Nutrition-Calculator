import express from "express";
import {MongoClient} from 'mongodb';
import bcrypt from 'bcrypt';
import User from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";
import "dotenv/config.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

//Test for server status at this url
//The initial await client..... to the response status is AI generated code
router.get("/health", async (req, res) => {
    const client = new MongoClient(process.env.MONGODB_URI)
    try {
    await client.db(process.env.MONGODB_DB).command({ ping: 1 })
    res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error('Error occurred while checking server status:', error)
    res.status(500).json({ status: 'error' })
  }
})

//Attempst to register a new user
router.post("/users", async (req, res) => {
  try {
    const {username, email, password} = req.body;
    const userExists = await User.findOne({ email });

    if(userExists){
      return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const registerUser = new User({
      username,
      email,
      hashedPassword
    }) 
    
    await registerUser.save();
    const token = jsonwebtoken.sign({ id: registerUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({token, username:registerUser.username, message: "User has successfully registered"});

  } catch (err) {
     res.status(500).json({error: err.message})
  }
})

//Attempst to update username
router.put("/update-username", async (req, res) => {
  const {username, email} = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      {email: email},
      {$set: {username: username}},
      {returnDocument: "after"}
    );
    if(!updatedUser){
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (err){
    res.status(500).json({success: false, message: err.message});
  }
})

//Attempst to login the user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verify user existence
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist." });

    // Verify password matching
    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // Generate Verification JWT Token
    const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, username:user.username, message: "Login successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Returns the logged-in user's info (used by the frontend to check the token is still valid)
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-hashedPassword");
    if (!user) return res.status(401).json({ message: "User no longer exists." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export default router;