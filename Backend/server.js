import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routers/foodRoute.js"
import userRouter from "./routers/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routers/cartRoute.js"
import orderRouter from "./routers/orderRoute.js"
//app config(initialize the app using express server)
const app = express()
//const port = process.env.PORT || 4001;
const port = 4000 //port number where our server would be running

//middleware 
app.use(express.json())
app.use(cors())

//db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
}) //HTTP method using that we can get the data from the server
//Run the express server
app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`);
})

//mongodb+srv://mern_stack__786:<db_password>@cluster0.yuqjc.mongodb.net/?