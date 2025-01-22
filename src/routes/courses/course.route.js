import express from 'express';
import { createUserApi,
     getUser,
      getUsers,
      updateUser,
      deleteUser
     } from "./course.controller.js";
const router = express.Router();
// post single users
router.post("/create", createUserApi);
// patch single users
router.patch("/:_id", updateUser);
// delete single users
router.delete("/:_id", deleteUser);
// single users
router.get("/single/:id", getUser);
// all users
router.get("/allcourse", getUsers);


export default router;
