
import { ObjectId } from "mongodb";
import { course } from "./course.modal.js";
// const { ObjectId } = mongoose.Types;


// create course
export const createuser = async (data) => {
    const result = new course(data);
    await result.save();
    return result;

};


export const patchJob = async ({
  _id,
  data,
})=> {
  const query = { _id: new ObjectId(_id) };
  const updateDoc = { $set: data };
  const option = { upsert: true, runValidators: true };
  const result = await course.findByIdAndUpdate(query, updateDoc, option);
  return result;
};

// delete Job
export const removeJob = async (_id) => {
  const result = await course.findByIdAndDelete({ _id: new ObjectId(_id) });
  return result;
};

// get single Job from DB
export const getSingelUser = async (id) => {
  const result = await course.findById(
    id
  )
  return result;
};

// get Jobs from DB
export const getALLusers = async ()=> {
  const result = await course.find({});
  return result;
};


