
import { Job } from "./testimonial.model.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

// create Job
export const createJob = async (data) => {
  const result = new Job(data);
  await result.save();
  return result;
};

// Create multiple Jobs
export const createJobMany = async (dataArray) => {
  // dataArray should be an array of objects
  if (!Array.isArray(dataArray)) {
    throw new Error("Input data must be an array of objects.");
  }

  // Using insertMany to handle bulk upload of jobs
  const result = await Job.insertMany(dataArray);

  return result;
};

export const patchJob = async ({
  _id,
  data,
})=> {
  const query = { _id: new ObjectId(_id) };
  const updateDoc = { $set: data };
  const option = { upsert: true, runValidators: true };
  const result = await Job.findByIdAndUpdate(query, updateDoc, option);
  return result;
};

// delete Job
export const removeJob = async (_id) => {
  const result = await Job.findByIdAndDelete({ _id: new ObjectId(_id) });
  return result;
};

// get single Job from DB
export const getJobApi = async (_id) => {
  const result = await Job.findOne({ _id: new ObjectId(_id) });
  return result;
};

// get Jobs from DB
export const getJobsApi = async ()=> {
  const result = await Job.find();
  return result;
};
