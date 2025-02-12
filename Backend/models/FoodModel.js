import mongoose from "mongoose"; // Corrected the import statement

// Create schema
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
});

// Using Schema, create the model
const FoodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default FoodModel;

