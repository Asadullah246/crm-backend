import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    templateData: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },

  },
  { timestamps: true }
);

const Job = model("Template", jobSchema);


export { Job };
