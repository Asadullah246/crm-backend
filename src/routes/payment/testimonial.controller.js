
import {
  createJob,
  getJobApi,
  getJobsApi,
  patchJob,
  removeJob,
} from "./testimonial.service.js";
import { Job } from "./testimonial.model.js";

// create a single user
export const createUserApi2 = async (
  req,
  res,
  next
) => {
  try {
    const data = req.body;


    // if (req.file) {
    //   // Save the file path to the database
    //   const imagePath = `/uploads/${req.file.filename}`;
    //   data.logoImage = imagePath;
    // }

    const user = await createJob(data);
    return res.status(201).json({ status: "success", data: user });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ massage: error });
  }
};



export const createUserApi = async (req, res) => {
  try {
    const {  customerId, paymentsData, paymentMethod } = req.body;
    console.log("cus", customerId, "pay", paymentsData);

    // Prepare an array for bulk insertion
    let paymentsToInsert = [];

    paymentsData.forEach((payment) => {
      payment.dueDetails.forEach((due) => {
        paymentsToInsert.push({
          transactionId: payment.transactionId ,
          customerId: customerId,
          paymentMethod:paymentMethod,
          monthForPayment: due.month, // Store month separately
          amount: due.dueAmount,
          status: "completed", // Default to pending if not provided
        });
      });
    });

    // Insert all payments at once
    if (paymentsToInsert.length > 0) {
      const result = await Job.insertMany(paymentsToInsert);
      return res.status(201).json({ status: "success", message: "Payments saved successfully", data: result });
    } else {
      return res.status(400).json({ status: "error", message: "No payments to save" });
    }

  } catch (error) {
    console.error("Error saving payments:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
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


    if (req.file) {
      // Save the file path to the database
      const imagePath = `/uploads/${req.file.filename}`;
      data.logoImage = imagePath;
    }

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

// get single users
export const getUser = async (
  req,
  res,
  next
) => {
  try {
    const { _id } = req.params;
    const users = await getJobApi(_id);
    return res.status(201).json({ status: "success", data: users });
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
    const users = await getJobsApi();
    return res.status(201).json({ status: "success", data: users });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ massage: error });
  }
};



