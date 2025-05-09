import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {

    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },


  },
  { timestamps: true }
);

const user = model("Admin", userSchema);

export { user };

