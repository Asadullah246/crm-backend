

import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  type: {
    type: [String],
    enum: ['product', 'service', 'subscription'], 
    required: true
  },


  oneTimePaymentAmount: { type: Number },
  emiOptions: [
    {
      duration: { type: Number, required: false },
      pricePerMonth: { type: Number, required: false }
    }
  ],


  subscriptionDetails: {
    minDuration: { type: Number },
    maxDuration: { type: Number },
    monthlyFee: { type: Number }
  },

  createdAt: { type: Date, default: Date.now }
});


const Job = model("ProductService", ProductSchema);


export { Job };

