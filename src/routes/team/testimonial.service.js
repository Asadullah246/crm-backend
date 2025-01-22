
import { Job } from "./testimonial.model.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

// create Job
export const createJob = async (data) => {
  const result = new Job(data);
  await result.save();
  return result;
};


export const patchJob = async ({
  _id,
  data,
})=> {
  const query = { _id: new ObjectId(_id) };
  const updateDoc = { $set: data };
  // const updateDoc = { $push: { comments: data } }; 
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
