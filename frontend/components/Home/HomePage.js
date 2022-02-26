import styles from "../../styles/Home/HomePage.module.css";
import { useRouter } from "next/router";
export default function HomePage(props) {
  const router = useRouter();
  return (
    <div
      className={styles.root}
      id="home"
      style={{ filter: props.open || props.signUpOpen ? "blur(10px)" : "" }}
    >
      <div className={styles.homePage__text}>
        We Have The Best Deals For<br></br>Parking Lots!
        <div className={styles.homePage__subtext}>
          Instantly book your space
        </div>
        <button
          className={styles.homePage__buttons}
          onClick={() => router.push("/AddSlot")}
        >
          ADD SLOT
        </button>
        <button className={styles.homePage__buttons} onClick={() => router.push("/BookSlot")}>BOOK SLOT</button>
      </div>
      <div className={styles.homePage__widgets}>
        {/* <img
          src="/widgets.png"
          alt="widgets"
          className={styles.homePage__widget__img}
        /> */}
        <img onClick={()=>router.push("/profile")} src="/profile.jpeg" className={styles.homePage__widget__img}/>
        <img onClick={()=>router.push("/History/addSlotHistory")} src="/history.jpeg" className={styles.homePage__widget__img}/>
        <img onClick={()=>router.push("/History/bookSlotHistory")} src="/wallet.jpeg" className={styles.homePage__widget__img}/>
      </div>
      <div>
        <img src="/chat.png" alt="chat" className={styles.homePage__chat} />
      </div>
    </div>
  );
}
