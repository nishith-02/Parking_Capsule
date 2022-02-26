const express=require("express")
const {signin,signup,getUser,forgotPassword, resetPassword, updateUser}=require('../controllers/users.js')
const router=express.Router()
router.post('/signin',signin)
router.post('/signup',signup)
router.get('/:id',getUser)
router.post('/forgotpassword',forgotPassword)
router.post('/reset-password/:id',resetPassword)
router.patch('/updateuser/:id',updateUser)
module.exports=router