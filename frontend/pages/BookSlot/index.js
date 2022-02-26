import NavigationBar from "../../components/Home/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import BookParkingSlot from "../../components/BookSlot/BookParkingSlot";
import { useEffect } from "react";
import { useRouter } from "next/router";
const BookSlot = () => {
  const router=useRouter()
  useEffect(()=>{
    if(localStorage.getItem("user")===null){
      router.push("/")
    }
  },[])
  return (
    <>
      <NavigationBar />
      <BookParkingSlot />
    </>
  );
};
export default BookSlot;