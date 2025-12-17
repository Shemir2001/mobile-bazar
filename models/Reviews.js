import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Make optional for guest reviews
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // For guest reviews
    name: {
      type: String,
      required: function() {
        return !this.user; // Required if no user
      }
    },
    email: {
      type: String,
      required: function() {
        return !this.user; // Required if no user
      }
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);