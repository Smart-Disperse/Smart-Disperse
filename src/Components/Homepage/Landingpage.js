"use client";
import { React, useState } from "react";
import Image from "next/image";
import img1 from "../../Assets/homeImg2.webp";
import { useRouter } from "next/navigation";
import img2 from "../../Assets/homeImg1.webp";
import gif from "../../Assets/output-onlinegiftools.gif";
import list from "../../Assets/listgii.gif";
import send from "../../Assets/sendgif.gif";
import historyview from "../../Assets/view.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import homeStyle from "../Homepage/landingpage.module.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import {
  faArrowRight,
  faGlobe,
  faTimes,
  faExchangeAlt,
  faLink,
  faMapMarked,
} from "@fortawesome/free-solid-svg-icons";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

function Modal({ closeModal, handleContinue, handleSameChain }) {
  return (
    <div className={homeStyle.custommodal}>
      <div className={homeStyle.custommodalheader}>
        <div style={{ width: "90%" }}>
          <h6 className={homeStyle.modaltitle}>
            <FontAwesomeIcon icon={faGlobe} />
            &nbsp; SELECT TRANSACTION PATH
          </h6>
        </div>
        <button
          className={`${homeStyle["customclosebutton"]} ${homeStyle["closebtn"]}`}
          onClick={closeModal}
          style={{ fontSize: "20px" }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className={homeStyle.popupbuttonflex}>
        <button
          className={homeStyle.continuebutton}
          onClick={handleContinue}
          disabled
          style={{ width: "70%", margin: "10px auto", padding: "10px" }}
        >
          Start Cross-Chain Transaction <br />
          (Coming Soon...)
        </button>
        <button
          className={homeStyle.samechainbutton}
          onClick={handleSameChain}
          style={{ width: "70%", margin: "10px auto" }}
        >
          Continue on the Same Chain
        </button>
      </div>
    </div>
  );
}

export default function Landingpage() {
  const router = useRouter();
  // const { themeClass } = useTheme();
  const { openConnectModal } = useConnectModal();
  // const navigate = useNavigate();
  // const { isConnected } = useAccount();
  const [showModal, setShowModal] = useState(false);

  const handleGetStartedClick = () => {
    // if (isConnected) {
    setShowModal(true);
    // } else {
    // openConnectModal();
    // }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleContinue = () => {
    navigate("/cross-transfers");
    closeModal();
  };

  const handleSameChain = () => {
    router.push("/same-chain");
    closeModal();
  };

  return (
    <div className={homeStyle.wholelandingpage}>
      <Navbar />
      <Image className={homeStyle.imageleft} src={img1} alt="not found" />
      <Image className={homeStyle.imageright} src={img2} alt="not found" />
      <div
        className={`${homeStyle["maindivihomepage"]} ${
          showModal ? `${homeStyle["blurbackground"]}` : ""
        }`}
      >
        <div className={homeStyle.maindivihomepage}>
          <div className={homeStyle.ihomepagetitlei}>
            <h1 className={homeStyle.ihometitleii}>All Chains, One Solution</h1>
          </div>
          <div className={homeStyle.ihomepagetitlei}>
            <h1 className={homeStyle.ihometitleii}>
              Smart-Disperse Your Crypto Transactions!
            </h1>
          </div>
          <div className={homeStyle.homebuttonsdiv}>
            <button
              className={homeStyle.getstartedbutton}
              onClick={handleGetStartedClick}
              style={{
                background: "#05F0E8",
                background:
                  "linear-gradient(to right, #05F0E8 13%, #13FF03 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Get Started{" "}
              <FontAwesomeIcon
                style={{ width: "22px", margin: "4px" }}
                icon={faArrowRight}
              />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${homeStyle["maindivforuserguide"]} ${
          showModal ? `${homeStyle["blurbackground"]}` : ""
        }`}
      >
        <div className={homeStyle.userguideborderdiv}>
          <p
            style={{
              fontSize: "23px",
              background: "#05F0E8",
              background:
                "linear-gradient(to right, #05F0E8 13%, #13FF03 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              // marginBottom: "5px",
              fontWeight: "800",
              letterSpacing: "1px",
            }}
            className={homeStyle.homepera}
          >
            Smart-Disperse Walkthrough
          </p>
          <div className={homeStyle.rectangleboxfor4cards}>
            <div id={homeStyle.a} className={homeStyle.card}>
              <Image className={homeStyle.iconnn} src={gif} alt="non" />
              <h3
                id={homeStyle.c1}
                className={homeStyle.iconn}
                style={{ letterSpacing: "1px" }}
              >
                Connect Your Wallet
              </h3>
              <p style={{ letterSpacing: "1px", marginTop: "-15px" }}>
                Link your Wallet
              </p>
            </div>
            <div id={homeStyle.b} className={homeStyle.card}>
              <Image className={homeStyle.iconnn} src={list} alt="non" />
              <h3
                id={homeStyle.c2}
                className={homeStyle.iconn}
                style={{ letterSpacing: "1px" }}
              >
                List Transactions
              </h3>
              <p style={{ letterSpacing: "1px", marginTop: "-15px" }}>
                Enter Recipient Details
              </p>
            </div>
            <div id={homeStyle.c} className={homeStyle.card}>
              <Image className={homeStyle.iconnn} src={send} alt="non" />
              <h3
                id={homeStyle.c3}
                className={homeStyle.iconn}
                style={{ letterSpacing: "1px" }}
              >
                Send Transaction
              </h3>
              <p style={{ letterSpacing: "1px", marginTop: "-15px" }}>
                Initiate the transaction
              </p>
            </div>
            <div id={homeStyle.d} className={homeStyle.card}>
              <Image className={homeStyle.iconnn} src={historyview} alt="non" />
              <h3
                id={homeStyle.c4}
                className={homeStyle.iconn}
                style={{ letterSpacing: "1px" }}
              >
                View History
              </h3>
              <p style={{ letterSpacing: "1px", marginTop: "-15px" }}>
                Monitor your Transactions
              </p>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className={homeStyle.modaloverlay}>
          <div className={homeStyle.modalcontainer}>
            <Modal
              closeModal={closeModal}
              handleContinue={handleContinue}
              handleSameChain={handleSameChain}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
