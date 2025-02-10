

import mongoose, { Schema, model } from "mongoose";

const TransactionSchema = new Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductService', required: true },
  productName: { type: String, required: true },
  type: { type: String, enum: ['oneTimePayment', 'emi', 'subscription'], required: false },

  // emiDetails: { duration: { type: Number },
  emiDetails: {
    duration: {
      type: Number,
      required: false // Makes this field mandatory
    },
    pricePerMonth: {
      type: Number,
      required: false // Makes this field mandatory
    }
  },
  subscriptionDetails: {
    duration: {
      type: Number,
      required: false // Makes this field mandatory
    },
    pricePerMonth: {
      type: Number,
      required: false // Makes this field mandatory
    }
  },

  oneTimePaymentAmount: { type: Number },

  totalAmount: { type: Number, required: false },  
  note: { type: String, required: false },
  description: { type: String, required: false },
  startDate: { type: Date, required: true },
  paymentStartDate: { type: Date, required: false },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'completed','pending','draft', 'cancelled'], default: 'active' },

  // Payments reference
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],

  createdAt: { type: Date, default: Date.now }
});


const Job = model("Transaction", TransactionSchema);


export { Job };

