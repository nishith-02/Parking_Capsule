const express = require("express");
const router = express.Router();
const auth = require("../auth/user");
const {
  bookSlot,
  getHistory,
  extendBookingTime,
} = require("../controllers/bookSlot");

router.post("/", auth, bookSlot);
router.get("/", auth, getHistory);
router.post("/extend", auth, extendBookingTime);

module.exports = router;
