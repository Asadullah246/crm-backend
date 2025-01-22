// const get user
import express from "express";
import {
  createUserApi,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "./testimonial.controller.js";
import authenticateToken from "../../middleware/authentication.js";

const router = express.Router();

// post single users
// router.post("/",upload.single('logoImage'), createUserApi);
// // patch single users
// router.patch("/:_id",upload.single('logoImage'), updateUser);
router.post("/",
// authenticateToken,
createUserApi);
// patch single users
router.patch("/:_id",
//  authenticateToken,
 updateUser);
// delete single users
router.delete("/:_id",
// authenticateToken,
deleteUser);
// single users
router.get("/:_id",
// authenticateToken,
 getUser);
// all users
router.get("/",
// authenticateToken,
 getUsers);

export default router;
