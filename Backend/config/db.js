import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://mern_stack__786:Jai_Sabar_Peer_Ji@cluster0.yuqjc.mongodb.net/food_delivery_app?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("DB Connection Error: ", error.message);
    }
};