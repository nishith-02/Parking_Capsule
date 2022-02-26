import axios from "axios";
import { useState } from "react";
import styles from "../../styles/BookSlot/BookParkingSlotCard.module.css";
import useRazorpay from "react-razorpay";
import { useRouter } from "next/router";
export default function BookParkingSlotCard(props) {
  const Razorpay = useRazorpay();
  const router = useRouter();
  const [twoWheelers, setTwoWheelers] = useState(0);
  const [fourWheelers, setFourWheelers] = useState(0);
  const [hours, setHours] = useState(0);
  const [error, setError] = useState("");
  const paymentHandler = async () => {
    try {
      if (!fourWheelers || !twoWheelers) {
        return setError("Number of slots is a mandatory field");
      } else if (
        twoWheelers > props.twoWheelers ||
        fourWheelers > props.fourWheelers
      ) {
        return setError(
          "Slots are unavailable, Please decrease the number of slots!"
        );
      } else if (!hours) {
        return setError("Hours is a mandatory field");
      } else {
        const bookUrl = "http://localhost:5000/book";
        const bookRes = await axios.post(
          bookUrl,
          {
            noOfTwoWheelerBooked: twoWheelers,
            noOfFourWheelerBooked: fourWheelers,
            hoursBooked: hours,
            parkingSlotId: props.id,
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).token
              }`,
            },
          }
        );

        const url = "http://localhost:5000/payment";
        const response = await axios.post(
          url,
          {
            id: bookRes.data.data._id,
          },
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("user")).token
              }`,
            },
          }
        );
        const data = response.data.data;
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          name: "travelCapsule",
          description: "Some Description",
          order_id: data.payment_id,
          handler: async (response) => {
            try {
              const updateUrl = `http://localhost:5000/payment/${data._id}`;
              const captureResponse = await axios.patch(
                updateUrl,
                {
                  status: "success",
                  razorpay_payment_id_res: response.razorpay_payment_id,
                  razorpay_order_id_res: response.razorpay_order_id,
                  razorpay_signature_res: response.razorpay_signature,
                },
                {
                  headers: {
                    Authorization: `Bearer ${
                      JSON.parse(localStorage.getItem("user")).token
                    }`,
                  },
                }
              );
              alert("Your booking is confirmed!");
              if (typeof window !== "undefined") {
                window.location.href =
                  "https://www.google.com/maps/dir/?api=1&destination=" +
                  encodeURIComponent(props.location) +
                  "&travelmode=driving";
              }
            } catch (error) {
              console.log(error);
            }
          },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <div className={styles.imageDiv}>
          <img src={props.parkingImage} className={styles.img} />
        </div>
        <div className={styles.info}>
          <div>
            <h4>{props.location}</h4>
            <h6 style={{ color: "#4d4d4d" }}>₹ {props.amount}</h6>
            {error && (
              <div style={{ color: "red", fontSize: "10px" }}>{error}</div>
            )}
          </div>
          <div className={styles.inputs}>
            <input
              onChange={(e) => setTwoWheelers(e.target.value)}
              className={styles.input}
              type="text"
              placeholder="Number of two wheelers"
            />
            <input
              onChange={(e) => setFourWheelers(e.target.value)}
              className={styles.input}
              type="text"
              placeholder="Number of four wheelers"
            />
            <input
              onChange={(e) => setHours(e.target.value)}
              className={styles.smallInput}
              type="text"
              placeholder="Hours"
            />
            <button
              className={styles.button}
              type="button"
              onClick={paymentHandler}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
