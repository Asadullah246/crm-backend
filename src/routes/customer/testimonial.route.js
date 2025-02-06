// const get user
import express from "express";
import { createUserApi, createUserApiMany, deleteUser, getUser, getUsers, updateUser, getUserWithPayment } from "./testimonial.controller.js";

const router = express.Router();

// post single users
router.post("/",
// upload.single('logoImage'),
 createUserApi);
router.post("/many",
// upload.single('logoImage'),
createUserApiMany);
// patch single users
router.patch("/:_id",
// upload.single('logoImage'),
 updateUser);
// delete single users
router.delete("/:_id", deleteUser);
// single users
router.get("/:_id", getUser);
router.get("paymentInfo/:_id", getUserWithPayment);
// all users
router.get("/", getUsers);

export default router;
