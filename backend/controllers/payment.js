const bookingModel = require("../models/bookingslot");
const parkingModel = require("../models/parkingslots");
const Payment = require("../models/payment");
const User = require("../models/users");
const { nanoid } = require("nanoid");
const Razorpay = require("razorpay");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const razorpay = new Razorpay({
  key_id: process.env.RAZAR_PAY_ID,
  key_secret: process.env.RAZAR_PAY_SECRET,
});

const createPayment = async (req, res, next) => {
  try {
    const check = await bookingModel.findById(req.body.id);
    if (!check) {
      return res.status(404).json({
        success: false,
        message: "No slot found",
      });
    }

    const payment_capture = 1;
    const amount = check.amountToBePaid * 100;
    const currency = "INR";
    const options = {
      amount: amount.toString(),
      currency,
      receipt: nanoid(),
      payment_capture,
    };

    const razorpayResponse = await razorpay.orders.create(options);

    const data = await Payment.create({
      userId: req.user.id,
      bookingSlotId: req.body.id,
      razarPayObjectStringfy: JSON.stringify(razorpayResponse),
      amount: razorpayResponse.amount,
      receipt: razorpayResponse.receipt,
      payment_id: razorpayResponse.id,
    });

    // Remove Unnecessary
    data.razarPayObjectStringfy = undefined;

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const getSinglePayment = async (req, res, next) => {
  try {
    const paymentId = req.params.paymentId;
    const paymentData = await Payment.findById(paymentId);
    if (!paymentData) {
      return res.status(404).json({
        success: false,
        message: "No payment found with id",
      });
    }
    res.json({
      success: true,
      data: paymentData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const paymentId = req.params.paymentId;
    const check = await Payment.findById(paymentId);
    // console.log(check);
    if (!check) {
      return res.status(404).json({
        success: false,
        message: "No payment with that id",
      });
    }
    const paymentData = await Payment.findByIdAndUpdate(paymentId, req.body, {
      new: true,
    });
    console.log("oayment", paymentData);
    const bookingSlotDetails = await bookingModel.findById(
      paymentData.bookingSlotId
    );
    const parkingSlotDetails = await parkingModel.findById(
      bookingSlotDetails.parkingSlotId
    );
    const ownerUser = await User.findById(parkingSlotDetails.createdBy);
    const bookerUser = await User.findById(req.user.id);
    // console.log(bookerUser);
    // console.log(ownerUser);
    console.log(req.user.id, paymentData.userId);
    const toOwner = "+91" + ownerUser.phoneNumber;
    client.messages
      .create({
        body: `${bookerUser.name} has booked a parking slot which you own(${
          parkingSlotDetails.location
        }). He/She has booked ${
          bookingSlotDetails.noOfTwoWheelerBooked
        } two wheelers and ${
          bookingSlotDetails.noOfFourWheelerBooked
        } four wheelers for ${
          bookingSlotDetails.hoursBooked
        } hours and an amount of ${
          paymentData.amount / 100
        } has been transfered to your account.`,
        from: process.env.from,
        to: toOwner,
      })
      .then((message) => {
        console.log("message sent to owner :" + message);
      })
      .catch((error) => {
        console.log(error);
      });
    const to = "+91" + bookerUser.phoneNumber;
    client.messages
      .create({
        body: `You have successfully booked the parking slot with payment id ${paymentData.payment_id}. The owner of the parking slot is ${ownerUser.name}. The contact details of the parking slot owner is phone number:${ownerUser.phoneNumber} and his/her email is ${ownerUser.email}`,
        from: process.env.from,
        to: to,
      })
      .then((message) => {
        console.log("message sent to booker :" + message);
      })
      .catch((error) => {
        console.log(error);
      });
    res.status(200).json({
      success: true,
      data: paymentData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};
module.exports = {
  createPayment,
  getSinglePayment,
  updatePayment,
};
