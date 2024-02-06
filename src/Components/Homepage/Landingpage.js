"use-client";
import React from "react";
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
      <div className="ihomepagetitlei">
        <h1 className="ihometitleii">All Chains, One Solution</h1>
      </div>
      <div className="ihomepagetitlei">
        <h1 className="ihometitleii">
          Smart-Disperse Your Crypto Transactions!
        </h1>
      </div>
      <div className="navbarbuttonsdiv">
        <button
          className="getstartedbutton"
          // onClick={handleGetStartedClick}
          style={{
            background: "#05F0E8",
            background: "linear-gradient(to right, #05F0E8 13%, #13FF03 100%)",
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
  );
}
