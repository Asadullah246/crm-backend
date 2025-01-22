import { Schema, model } from "mongoose";


const jobSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    designation: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },

    description: {
      type:String,
      required: false,
    },
    facebook: {
      type:String,
      required: false,
    },
    twitter: {
      type:String,
      required: false,
    },
    youtube: {
      type:String,
      required: false,
    },
    linkedIn: {
      type:String,
      required: false,
    },
    instagram: {
      type:String,
      required: false,
    },
    showInHomePage: {
      type:Boolean,
      required: true,
    },
    role: {
      type:String,
      required: true,
    },
    serial: {
      type:Number,
      required: false,
    },

  },
  { timestamps: true }
);

const Job = model("Teams", jobSchema);

export { Job };
