import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    websiteName: {
      type: String,
      required: false,
    },
    metaText: {
      type: String,
      required: false,
    },
    logo: {
      type: String,
      required: false, 
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    facebook: {
      type: String,
      required: false,
    },
    twitter: {
      type: String,
      required: false,
    },
    instagram: {
      type: String,
      required: false,
    },
    linkedIn: {
      type: String,
      required: false,
    },
    youtube: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Job = model("websiteInfo", jobSchema);

export { Job };
