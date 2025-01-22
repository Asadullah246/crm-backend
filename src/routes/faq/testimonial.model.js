import { Schema, model } from "mongoose";

const faqSchema = new Schema(
  {
    faqData: [
      {
        id: {
          type: Number,
          required: false,
        },
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true, 
        },
      },
    ],
  },
  { timestamps: true }
);

const Job = model("Faq", faqSchema);

export { Job };
