import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    hashedPassword: {type: String, required: true} 
}, { bufferCommands: false });

const User = mongoose.model("User", userSchema);
export default User;