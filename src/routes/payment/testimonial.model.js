import mongoose, { Schema, model } from "mongoose";


const PaymentSchema = new Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true }, // Reference to the transaction
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }, // Reference to the customer
  paymentDate: { type: Date, default: Date.now }, // Date of payment
  amount: { type: Number, required: true }, // Amount paid
  paymentMethod: { type: String, required: true }, // Amount paid
  monthForPayment: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed','partial'], default: 'pending' }, // Payment status
  notes: { type: String } // Optional notes for the payment
});

// module.exports = mongoose.model('Payment', PaymentSchema);


const Job = model("Payment", PaymentSchema); 


export { Job };
