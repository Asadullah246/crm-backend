
import {
  createuser,
  createuser2,
  getALLusers,
  getSingelUser,
  patchJob,
  removeJob,
} from "./user.service.js";

// create a single user
export const createUserApi = async (
  req,
  res,
  next
) => {
  try {
    const data = req.body;
    const user = await createuser(data);
    // if(!user){
    //   return res.status(401).json({ massage: "user already exists" });
    // }
    // return res.status(200).json({ status: "success", data: user });
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    return res.status(401).json({ massage: error });
  }
};
export const createUserApi2 = async (
  req,
  res,
  next
) => {
  try {
    const data = req.body;
    const user = await createuser2(data);
    if(!user){
      return res.status(401).json({ massage: " no user found " });
    }
    return res.status(200).json({ status: "success", data: user });
  } catch (error) {
    return res.status(401).json({ massage: error });
  }
};

// patch a single user
export const updateUser = async (
  req,
  res,
  next
) => {
  try {
    const { _id } = req.params;
    const data = req.body;
    const user = await patchJob({ _id, data });
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ massage: error });
  }
};

// delete a single user
export const deleteUser = async (
  req,
  res,
  next
) => {
  try {
    const { _id } = req.params;
    const user = await removeJob(_id);
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ massage: error });
  }
};


// get all users
export const getUsers = async (
  req,
  res,
  next
) => {
  try {
    const users = await getALLusers();
    return res.status(200).json({ status: "success", data: users });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ massage: error });
  }
};
// get single users
export const getUser = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const users = await getSingelUser(id);
    return res.status(201).json({ status: "success", data: users });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ massage: error });
  }
};
