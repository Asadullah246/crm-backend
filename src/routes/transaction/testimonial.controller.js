
import { sendMailToAdmin } from "../../utilities/sendMail.js";
import {
  createJob,
  getJobApi,
  getJobsApi,
  patchJob,
  removeJob,
} from "./testimonial.service.js";

// create a single user
export const createUserApi = async (
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
    const  emailData={
      customer_id:data?.customerId,
      productName : data?.productName,
      type: data?.type,
      note:data?.note,
      startDate:data?.startDate,
      status: data?.status,

    };
    const sendMail = await sendMailToAdmin(emailData);
    return res.status(201).json({ status: "success", data: user , emailStatus: sendMail});
  } catch (error) {
    console.log(error);
    return res.status(201).json({ massage: error });
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


    // if (req.file) {
    //   // Save the file path to the database
    //   const imagePath = `/uploads/${req.file.filename}`;
    //   data.logoImage = imagePath;
    // }

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




export const getUsers = async (req, res) => {
  try {
    const { status, search, customerId } = req.query; // Extract query parameters

    let filter = {}; // Default empty filter

    if (status) {
      filter.status = status; // Filter by status (active/pending)
    }

    if (search) {
      filter.productName = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (customerId) {
      filter.customerId = customerId; // Filter by customer ID
    }

    const users = await getJobsApi(filter); // Pass the filter to Mongoose query
    return res.status(200).json({ status: "success", data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: error.message });
  }
};
