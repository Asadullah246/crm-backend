import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    client: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    expireDate: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    number: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: false,
    },
    service: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    vat: {
      type: Number,
      required: false,
    },
    vatPrice: {
      type: Number,
      required: false,
    },
    subTotal: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      required: false,
    },
    year: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Job = model("Invoice", jobSchema);


export { Job };
