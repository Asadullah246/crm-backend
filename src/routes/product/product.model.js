

import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true }, // Common for all
  description: { type: String },
  imageUrl: { type: String },
  type: {
    type: String,
    enum: ['product', 'service', 'product_with_service'],
    required: true
  }, // Identifies the nature of the entity

  // For products (One-time or EMI)
  oneTimePaymentAmount: { type: Number }, // For one-time payment
  emiOptions: [
    {
      duration: { type: Number, required: true }, // Specific EMI duration (e.g., 3 months)
      pricePerMonth: { type: Number, required: true } // EMI price for the duration
    }
  ],

  // For services and subscriptions
  subscriptionDetails: {
    minDuration: { type: Number }, // Minimum subscription duration (e.g., 12 months)
    maxDuration: { type: Number }, // Maximum subscription duration
    monthlyFee: { type: Number } // Monthly subscription fee
  },

  createdAt: { type: Date, default: Date.now }
});


const Job = model("ProductService", ProductSchema); 


export { Job };



// import { Schema, model } from "mongoose";

// const jobSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: false,
//     },
//     templateData: {
//       type: String,
//       required: true,
//     },
//     category: {
//       type: String,
//       required: false,
//     },

//   },
//   { timestamps: true }
// );

// const Job = model("Template", jobSchema);


// export { Job };

// const mongoose = require('mongoose');




// module.exports = mongoose.model('ProductService', ProductServiceSchema);

