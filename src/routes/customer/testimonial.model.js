import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    name: {
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
    annualUpfront: {
      type: Number,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    welcomePackSent: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    postalCode: {
      type: String,
      required: false,
    },
    serviceType: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    randomId: {
      type: String,
      required: false,
    },
    lastPayment: {
      type: String,
      required: false,
    },
    startingDate: {
      type: String,
      required: false,
    },
    firstAnnualServiceDate: {
      type: String,
      required: false,
    },
    annualServiceDueDate: {
      type: String,
      required: false,
    },
   

  },
  { timestamps: true }
);

const Job = model("Customer", jobSchema);


export { Job };
