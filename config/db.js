import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
const mongourl=process.env.MONGO_URL|| "mongodb+srv://Shreyas4545:20169361@cluster0.1npzh7f.mongodb.net/?retryWrites=true&w=majority"

export const connectDB=mongoose.connect(mongourl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB Connected Successfully");
}).catch((err) =>{
    console.log("DB Connection Failed");
    console.log(err);   
    process.exit(1);
});

export default connectDB;