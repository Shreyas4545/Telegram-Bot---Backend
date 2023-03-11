import mongoose from "mongoose";
import validator from "validator"
import bcrypt from "bcryptjs"

const adminSchema = new mongoose.Schema({
      email:{
        type:String,
        unique:true
      },
      password:{
        type:String
      }
});

adminSchema.pre('save',async function(next) {
    if(!this.isModified('password')){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10)
})


adminSchema.methods.isValidatedPassword = async function(userpassword,actualpassword){
  return await bcrypt.compare(userpassword,actualpassword);
}

const Admin = mongoose.model("Admin",adminSchema);
export default Admin;