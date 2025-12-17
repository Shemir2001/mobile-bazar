import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    viewCount: {
  type: Number,
  default: 0,
  index: true  // Add index for better query performance
},
purchaseCount: {
  type: Number,
  default: 0,
  index: true
},
lastViewedAt: {
  type: Date,
  default: null
},
popularityScore: {
  type: Number,
  default: 0,
  index: true
},
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "PKR",
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // ✅ NEW FIELD (replaces quantity)
    stockStatus: {
      type: String,
      enum: ["in-stock", "out-of-stock"],
      default: "in-stock",
    },

    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
