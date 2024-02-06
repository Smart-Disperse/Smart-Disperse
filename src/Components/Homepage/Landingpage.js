"use-client";
import React from "react";
import Image from "next/image";
import img1 from "../../Assets/homeImg2.webp";
import img2 from "../../Assets/homeImg1.webp";
import gif from "../../Assets/output-onlinegiftools.gif";
import list from "../../Assets/listgii.gif";
import send from "../../Assets/sendgif.gif";
import historyview from "../../Assets/view.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./landingpage.css";
import {
  faArrowRight,
  faGlobe,
  faTimes,
  faExchangeAlt,
  faLink,
  faMapMarked,
} from "@fortawesome/free-solid-svg-icons";

export default function Landingpage() {
  return (
    <div>
      <Image className="imageright" src={img2} alt="not found" />
      <Image className="imageleft" src={img1} alt="not found" />
      <div className="maindivihomepage">
        <div className="ihomepagetitlei">
          <h1 className="ihometitleii">All Chains, One Solution</h1>
        </div>
        <div className="ihomepagetitlei">
          <h1 className="ihometitleii">
            Smart-Disperse Your Crypto Transactions!
          </h1>
        </div>
        <div className="homebuttonsdiv">
          <button
            className="getstartedbutton"
            // onClick={handleGetStartedClick}
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
      <div className="userguideborderdiv">
        <p
          style={{
            fontSize: "23px",
            background: "#05F0E8",
            background: "linear-gradient(to right, #05F0E8 13%, #13FF03 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            // marginBottom: "5px",
            fontWeight: "800",
            letterSpacing: "1px",
          }}
          className="homepera"
        >
          Smart-Disperse Walkthrough
        </p>
        <div className="rectangleboxfor4cards">
          <div id="a" className="card">
            <Image className="iconnn" src={gif} alt="non" />
            <h3 id="c1" className="iconn" style={{ letterSpacing: "1px" }}>
              Connect Your Wallet
            </h3>
            <p style={{ letterSpacing: "1px", marginTop: "-15px" }}>
              Link your Wallet
            </p>
          </div>
          <div id="b" className="card">
            <Image className="iconnn" src={list} alt="non" />
            <h3 id="c2" className="iconn" style={{ letterSpacing: "1px" }}>
              List Transactions
            </h3>
            <p style={{ letterSpacing: "1px", marginTop: "-15px" }}>
              Enter Recipient Details
            </p>
          </div>
          <div id="c" className="card">
            <Image className="iconnn" src={send} alt="non" />
            <h3 id="c3" className="iconn" style={{ letterSpacing: "1px" }}>
              Send Transaction
            </h3>
            <p style={{ letterSpacing: "1px", marginTop: "-15px" }}>
              Initiate the transaction
            </p>
          </div>
          <div id="d" className="card">
            <Image className="iconnn" src={historyview} alt="non" />
            <h3 id="c4" className="iconn" style={{ letterSpacing: "1px" }}>
              View History
            </h3>
            <p style={{ letterSpacing: "1px", marginTop: "-15px" }}>
              Monitor your Transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
