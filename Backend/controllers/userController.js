import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login user
const loginUser = async (req, res) => {
   const { email, password } = req.body;
   try {
       // Check if user exists
       const user = await userModel.findOne({ email });
       if (!user) {
           return res.json({ success: false, message: "User does not exist" });
       }

       // Compare passwords
       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) {
           return res.json({ success: false, message: "Invalid Credentials" });
       } else {
           const token = createToken(user._id);
           return res.json({ success: true, token });
       }
   } catch (error) {
       console.log(error);
       return res.json({ success: false, message: "Error" });
   }
};

// Function to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register user
const registerUser = async (req, res) => {
    const name = req.body.name.trim();
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validate strong password
        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: "Please enter a stronger password" });
        }

        // Hash the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        return res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

export { loginUser, registerUser };

      
