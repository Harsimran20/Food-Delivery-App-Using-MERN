import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false } // Ensures empty objects are not removed
);

// Fix: Properly defining the model by checking if it already exists
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel; // Remove any unnecessary extra code
