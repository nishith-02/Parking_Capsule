const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    parkingSlotId: {
      type: mongoose.Types.ObjectId,
      ref: "parkingModel",
    },
    bookerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    totalAmount: {
      type: Number,
    },
    amountPerHour: {
      type: Number,
    },
    amountToBePaid: {
      type: Number,
    },
    noOfFourWheelerBooked: {
      type: Number,
    },
    noOfTwoWheelerBooked: {
      type: Number,
    },
    hoursBooked: {
      type: Number,
    },
    place:{
      type:String
    },
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
    created: {
      type: Number,
      default: Date.now(),
    },
    parkingSlotImage:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.model("Booking", bookingSchema);
module.exports = bookingModel;
