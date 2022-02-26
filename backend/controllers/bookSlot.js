const schedule = require("node-schedule");
const parkingModel = require("../models/parkingslots");
const bookingModel = require("../models/bookingslot");

const bookSlot = async (req, res) => {
  try {
    const bookerId = req.user.id;
    const {
      parkingSlotId,
      noOfTwoWheelerBooked,
      noOfFourWheelerBooked,
      hoursBooked,
      extend,
    } = req.body;

    const slot = await parkingModel.findById(parkingSlotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "No slot found",
      });
    }
    await parkingModel.findByIdAndUpdate(
      slot._id,
      {
        twoWheeler: slot.twoWheeler - noOfTwoWheelerBooked,
        fourWheeler: slot.fourWheeler - noOfFourWheelerBooked,
        noOfTotalSlotsBooked: slot.noOfTotalSlotsBooked + 1,
        noOfActiveSlots: slot.noOfActiveSlots + 1,
      },
      { new: true }
    );

    const book = await bookingModel.create({
      parkingSlotId,
      place:slot.location,
      bookerId,
      ownerId: slot.createdBy,
      totalAmount: slot.amount * hoursBooked,
      noOfFourWheelerBooked,
      noOfTwoWheelerBooked,
      hoursBooked,
      amountPerHour: slot.amount,
      amountToBePaid: slot.amount * hoursBooked,
      parkingSlotImage:slot.parkingImage,
      created: Date.now() + hoursBooked * 60 * 60 * 1000,
    });

    const startTime = new Date(Date.now() + hoursBooked * 60 * 60 * 1000);
    await schedule.scheduleJob(startTime, async () => {
      const slotDetails = await parkingModel.findById(parkingSlotId);
      await parkingModel.findByIdAndUpdate(
        slot._id,
        {
          twoWheeler: slotDetails.twoWheeler + noOfTwoWheelerBooked,
          fourWheeler: slotDetails.fourWheeler + noOfFourWheelerBooked,
          noOfActiveSlots: slotDetails.noOfActiveSlots - 1,
        },
        {
          new: true,
        }
      );
      // const bookedSlot = await bookingModel.findById(book._id);
      await bookingModel.findByIdAndUpdate(
        book._id,
        {
          status: "InActive",
        },
        { new: true }
      );
    });
    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await bookingModel.find({ bookerId: userId });
    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

const extendBookingTime = async (req, res) => {
  try {
    const { bookingId, extendedTime } = req.body;
    const order = await bookingModel.findById(bookingId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No slot found",
      });
    }

    //updating the amount and hours of extension
    const bookingDataAfterExtension = await bookingModel.findByIdAndUpdate(
      bookingId,
      {
        hoursBooked: order.hoursBooked + extendedTime,
        amountToBePaid: order.amountPerHour * extendedTime,
        totalAmount: order.totalAmount + order.amountPerHour * extendedTime,
      },
      {
        new: true,
      }
    );

    //Undo the old schedule Job
    const scheduleTime = new Date(order.created);
    await schedule.scheduleJob(scheduleTime, async () => {
      const slotDetails = await parkingModel.findById(order.parkingSlotId);
      await parkingModel.findByIdAndUpdate(
        order.parkingSlotId,
        {
          twoWheeler: slotDetails.twoWheeler - order.noOfTwoWheelerBooked,
          fourWheeler: slotDetails.fourWheeler - order.noOfFourWheelerBooked,
          noOfActiveSlots: slotDetails.noOfActiveSlots + 1,
        },
        {
          new: true,
        }
      );
      await bookingModel.findByIdAndUpdate(
        bookingId,
        {
          status: "Active",
        },
        { new: true }
      );
    });

    //Schedule Job for extension
    const extensionTime = new Date(
      order.created + extendedTime * 60 * 60 * 1000
    );

    await schedule.scheduleJob(extensionTime, async () => {
      const slotDetails = await parkingModel.findById(order.parkingSlotId);
      await parkingModel.findByIdAndUpdate(
        order.parkingSlotId,
        {
          twoWheeler: slotDetails.twoWheeler + order.noOfTwoWheelerBooked,
          fourWheeler: slotDetails.fourWheeler + order.noOfFourWheelerBooked,
          noOfActiveSlots: slotDetails.noOfActiveSlots - 1,
        },
        {
          new: true,
        }
      );
      await bookingModel.findByIdAndUpdate(
        bookingId,
        {
          status: "InActive",
        },
        { new: true }
      );
    });

    res.status(200).json({
      success: true,
      data: bookingDataAfterExtension,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

module.exports = {
  bookSlot,
  getHistory,
  extendBookingTime,
};
