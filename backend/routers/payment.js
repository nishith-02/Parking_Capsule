const express=require("express")
const auth = require("../auth/user")
const { createPayment, getSinglePayment,updatePayment } = require("../controllers/payment")
const router=express.Router()
router.post("/",auth,createPayment)
router.get("/:paymentId",auth,getSinglePayment)
router.patch("/:paymentId",auth,updatePayment)
module.exports=router