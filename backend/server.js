const express = require("express");
const app = express();
const auth = require("./auth/user.js");
const userRouter = require("./routers/users");
const parkingSlotRouter = require("./routers/parkingslots");
const bookingRouter = require("./routers/bookslot");
const paymentRouter = require("./routers/payment.js");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "100000000" }));
// app.use(express.limit(100000000));
app.use("/user", userRouter);
app.use("/parking", parkingSlotRouter);
app.use("/book", bookingRouter);
app.use("/payment", paymentRouter);

const ConnectDB = require("./config/db");
ConnectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
});
