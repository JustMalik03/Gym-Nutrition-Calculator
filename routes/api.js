import express from "express";
import {MongoClient} from 'mongodb';
import bcrypt from 'bcrypt';
import User from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";
import "dotenv/config.js";

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

router.post("/users", async (req, res) => {
  try {
    const {username, email, password} = req.body;
    const userExists = await User.findOne({ email });

    if(userExists){
      res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const registerUser = new User({
      username,
      email,
      hashedPassword
    }) 
    
    await registerUser.save();
    res.status(201).json({message: "User has successfully registered"});

  } catch (err) {
     res.status(500).json({error: err.message})
  }
})

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

    res.status(200).json({ token, message: "Login successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export default router;