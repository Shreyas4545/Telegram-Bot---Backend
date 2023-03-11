import bigpromise from "../middleware/bigpromise.js";
import Admin from "../Models/admin.js";
import User from "../Models/User.js";
export const signup = bigpromise(async (req, res, next) => {
  const { email, password } = req.body;
  const admin = await Admin.create({
    email,
    password,
  });
  console.log(admin);
  if (admin) {
    return res.status(200).json({
      success: true,
      message: "Successfully created Admin account",
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "Failed to create Admin account",
    });
  }
});

export const login = bigpromise(async (req, res, next) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email });
  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Invalid emailid",
    });
  }
  const admin1 = await admin.isValidatedPassword(
    req.body.password,
    admin.password
  );
  if (!admin1) {
    return res.status(404).json({
      success: false,
      message: "Invalid password",
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "Successfully Logged In !",
    });
  }
});

export const details = bigpromise(async (req, res, next) => {
  const users = await User.find({});
  if (users) {
    return res.status(200).json({
      success: true,
      message: "Successfully sent the user details",
      data: users,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "No users exist",
    });
  }
});

export const delete_user = bigpromise(async (req, res, next) => {
  console.log(req.body.id);
  const user = await User.findByIdAndDelete(req.body.id);
  if (user) {
    return res.status(200).json({
      success: true,
      message: "Successfully deleted the User !",
    });
  } else {
    return res.status(404).json({
      success: false,
      message: "User Don't Exist !",
    });
  }
});

export const update_user = bigpromise(async (req, res) => {
  const data = req.body;
  const updated = await User.findByIdAndUpdate(req.body.id,data,{
    new:true,
    runValidators:true,
    useModifyandUpdate:false
   });
  if (updated) {
    return res.status(200).json({
      success: true,
      message: "Successfully Updated the User !",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Error in Updating the User !",
    });
  }
});


