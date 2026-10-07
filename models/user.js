import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, minlength: 4, maxlength: 26 },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    emailToken: {type: String},
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
export default User;
