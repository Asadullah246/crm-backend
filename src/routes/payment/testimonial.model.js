import mongoose, { Schema, model } from "mongoose";

// const jobSchema = new Schema(
//   {
//     client: {
//       type: String,
//       required: true,
//     },
//     clientId: {
//       type: String,
//       required: true,
//     },
//     date: {
//       type: String,
//       required: true,
//     },
//     expireDate: {
//       type: String,
//       required: true,
//     },
//     note: {
//       type: String,
//       required: false,
//     },
//     number: {
//       type: Number,
//       required: false,
//     },
//     description: {
//       type: String,
//       required: false,
//     },
//     price: {
//       type: Number,
//       required: false,
//     },
//     service: {
//       type: String,
//       required: false,
//     },
//     status: {
//       type: String,
//       required: true,
//     },
//     vat: {
//       type: Number,
//       required: false,
//     },
//     vatPrice: {
//       type: Number,
//       required: false,
//     },
//     subTotal: {
//       type: Number,
//       required: false,
//     },
//     total: {
//       type: Number,
//       required: false,
//     },
//     year: {
//       type: String,
//       required: false,
//     },
//   },
//   { timestamps: true }
// );




// const mongoose = require('mongoose');

const PaymentSchema = new Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true }, // Reference to the transaction
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Reference to the customer
  paymentDate: { type: Date, default: Date.now }, // Date of payment
  amount: { type: Number, required: true }, // Amount paid
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // Payment status
  notes: { type: String } // Optional notes for the payment
});

// module.exports = mongoose.model('Payment', PaymentSchema);


const Job = model("Payment", PaymentSchema);


export { Job };
