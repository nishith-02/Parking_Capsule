const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: String,
    },
    upiId: {
      type: String,
      default: "",
    },
    bankAccountNumber: {
      type: String,
      default: "",
    },
    IFSCCode: {
      type: String,
      default: "",
    },
    NameOnBank: {
      type: String,
      default: "",
    },
    CreatedAt: {
      type: Date,
      default: Date.now(),
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("User", userSchema);
module.exports = user;
