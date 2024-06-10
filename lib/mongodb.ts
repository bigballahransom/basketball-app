import mongoose from "mongoose";

const connectMongoDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;
