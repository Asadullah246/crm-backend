import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: [
      {
        para: {
          type: String,
          required: false,

        },
        lists:[
          {type :String ,
            required:false}
        ]
      },
    ],
    imageThumb: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    // need to write reviews here


    ratings: [
      {
        userId: {
          type: Schema.ObjectId,
          required: false,
          ref: "User",
        },
        rating: {
          type: Number,
          required: false,
        },
      },
    ],
    totalStudent: {
      type: Number,
      required: false,
    },
    purchaseStudent: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    videosUrl: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        length: {
          type: String,
          required: false,
        },
      },
    ],
    reviews: [
      {
        name: {
          type: String,
          required: false,
        },
        image: {
          type: String,
          required: false,
        },
        userId: {
          type: String,
          required: false,
        },
        rating: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        designation: {
          type: String,
          required: false,
        },
      },
    ],
    ownerName: {
      type: String,
      required: true,
    },
    learning: [
        {
            description:{
                type:String,
                required: true,
            }
        }
    ],
    premium:{
        type:Boolean,
        required: true,
    }
},{
    timestamps: true,
});
export const course = model("course", courseSchema);
