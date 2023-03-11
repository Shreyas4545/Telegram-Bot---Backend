import express from "express";
const router = express.Router();
import {details, login, signup , update_user , delete_user} from "../Controllers/admin.controller.js"
router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/get-users").get(details);
router.route("/delete_user").delete(delete_user);
router.route("/update_user").put(update_user);
export default router;