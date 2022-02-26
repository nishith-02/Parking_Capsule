const mongoose = require("mongoose");

const parkingSchema = mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  fourWheeler: {
    type: Number,
  },
  twoWheeler: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Available", "UnAvailable"],
  },
  amount: {
    type: Number,
    required: true,
  },
  loc: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  parkingImage: {
    type: String,
  },
  noOfActiveSlots: {
    type: Number,
    default: 0,
  },
  noOfTotalSlotsBooked: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  phoneNumber:{
    type:String
  },
  createdByName:{
    type:String
  }
});

parkingSchema.index({ loc: "2dsphere" });

const parkingModel = mongoose.model("parkingslots", parkingSchema);

module.exports = parkingModel;
