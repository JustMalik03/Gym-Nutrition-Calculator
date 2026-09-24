import express from "express";
import "dotenv/config.js";
import cors from "cors";
import router from "../routes/api.js";
import mongoose from "mongoose"; 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Applying Middleware to allow frontend to communicate with server for local testing
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "http://localhost:5173");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Uses router to call api requests
app.use("/api", router);

const startServer = async () => {
  try {
    // This establishes the global connection that Mongoose models use
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB via Mongoose");

    app.listen(port, () => {
      console.log(`API server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Could not start server:", error);
    process.exit(1);
  }
};

startServer();