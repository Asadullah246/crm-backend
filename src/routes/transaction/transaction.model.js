

import mongoose, { Schema, model } from "mongoose";




const TransactionSchema = new Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductService', required: true },
  productName: { type: String, required: true },
  type: { type: String, enum: ['one_time', 'emi', 'subscription'], required: true },

  emiDetails: { duration: { type: Number }, pricePerMonth: { type: Number } },
  subscriptionDetails: { startDate: { type: Date }, endDate: { type: Date }, monthlyFee: { type: Number } },
  oneTimePaymentAmount: { type: Number },

  totalAmount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },

  // Payments reference
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],

  createdAt: { type: Date, default: Date.now }
});


const Transaction = model("Transaction", TransactionSchema);


export { Transaction };

