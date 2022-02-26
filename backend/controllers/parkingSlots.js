const parkingModel = require("../models/parkingslots");
const User=require("../models/users")

const getParkingSlots = async (req, res) => {
  try {
    const { lat, lng, km } = req.body;
    let radius = km / 6378.1;
    console.log(radius)
    const data = await parkingModel.find({
      "loc.coordinates": {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius],
        },
      },
      $or: [{ fourWheeler: { $gt: 0 } }, { twoWheeler: { $gt: 0 } }],
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const AddParkingSlot = async (req, res) => {
  try {
    const {
      location,
      fourWheeler,
      twoWheeler,
      amount,
      latitude,
      longitude,
      parkingImage,
    } = req.body;
    let userInfo=await User.findById(req.user.id)

    const parkingDetails = await parkingModel.create({
      location,
      fourWheeler,
      twoWheeler,
      status: "Available",
      amount,
      loc: {
        type: "Point",
        coordinates: [longitude || 0, latitude || 0],
      },
      createdBy: req.user.id,
      parkingImage,
      phoneNumber:userInfo.phoneNumber,
      createdByName:userInfo.name
    });

    res.status(201).json({
      success: true,
      data: parkingDetails,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

//get all the parking slots which user added
const getUserParkingSlots = async (req, res) => {
  try {
    const userId = req.user.id;
    const userAddedSlots = await parkingModel.find({ createdBy: userId });
    res.status(200).json({
      success: true,
      parkingData: userAddedSlots,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
};

const deleteSlot=async(req,res,next)=>{
  try{
    const parkinSlotId=req.params.parkingSlotId
    const data=await parkingModel.findByIdAndDelete(parkinSlotId)
    res.status(200).json({
      success:true,
      data
    })
  }
  catch(error){
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
}

const updateSlot=async(req,res,next)=>{
  try{
    const parkinSlotId=req.params.parkingSlotId
    const updatedParkingSlot=await parkingModel.findByIdAndUpdate(parkinSlotId,req.body,{
      new:true
    })
    res.status(200).json({
      success:true,
      data:updatedParkingSlot
    })
  }
  catch(error){
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: error,
    });
  }
}

module.exports = {
  getParkingSlots,
  AddParkingSlot,
  getUserParkingSlots,
  deleteSlot,
  updateSlot
};
