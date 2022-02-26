const express = require("express");
const router = express.Router();
const auth = require("../auth/user");

const {
  getParkingSlots,
  AddParkingSlot,
  getUserParkingSlots,
  updateSlot,
  deleteSlot
} = require("../controllers/parkingSlots");

router.get("/getParkingSlots", auth, getUserParkingSlots);
router.post("/getSlots", auth, getParkingSlots);
router.post("/addSlot", auth, AddParkingSlot);
router.delete("/:parkingSlotId",auth,deleteSlot)
router.patch("/:parkingSlotId",auth,updateSlot)

module.exports = router;
