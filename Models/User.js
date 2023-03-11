import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
      firstName:{
        type:String,
        required:true
      },
      lastName:{
        type:String,
        required:true
      },
      phoneNumber:{
        type:Number,
        required:true
      },
      email:{
        type:String,
        unique:true
      },
      activity_status:{
        type:Boolean,
      },
      position:{
          type:String
      }
});

userSchema.pre('save',async function(next) {
    if (!this.isModified('password')){
        return next();
    } 
    this.password = await bcrypt.hash(this.password,10)
})

const User = mongoose.model("User",userSchema);
export default User;