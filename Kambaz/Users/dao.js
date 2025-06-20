import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
} // implemented later
export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) =>  model.findOne({ username: username });
export const findUserByCredentials = (username, password) =>  model.findOne({ username, password });
export const updateUser = (userId, user) =>  model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => model.deleteOne({ _id: userId });

export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING ||       // Render / Atlas
  "mongodb://127.0.0.1:27017/kambaz";   // fallback(local)

mongoose.connect(CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log("✅ MongoDB connection established"))
  .catch(e => console.error("❌ MongoDB connection error:", e));
