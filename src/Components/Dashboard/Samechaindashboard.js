"use client";
import React, { useState, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Textify from "../DashboardComponents/Textify";
import Listify from "../DashboardComponents/Listify";
import Uploadify from "../DashboardComponents/Uploadify";
import Image from "next/image";
import img3 from "../../Assets/img3-bg.webp";
import img4 from "../../Assets/img4-bg.webp";
// import { useTheme } from "../../../ThemeProvider";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import samechainStyle from "./samechaindashboard.module.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Samechaindashboard() {
  //   const { toggleDarkMode, themeClass } = useTheme();
  const [activeTab, setActiveTab] = useState("text");
  //   const navigate = useNavigate();
  const { openConnectModal } = useConnectModal();
  //   const { address, isConnected } = useAccount();

  useEffect(() => {
    const hasVisitedBefore = document.cookie.includes("visited=true");
    if (!hasVisitedBefore) {
      document.cookie = "visited=true; max-age=31536000"; // Max age is set to 1 year in seconds
      const driverObj = driver({
        overlayColor: "#00000094",
        popoverClass: ` ${samechainStyle.driverpopover01}`,
        showProgress: true,
        steps: [
          {
            element: "#view",
            popover: {
              title: "Textify",
              description:
                "Effortlessly input recipient addresses and amounts in one line with Textify, whether through copy-paste or direct entry",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#create",
            popover: {
              title: "Listify",
              description:
                "Effortlessly send funds: Use Listify to fill out recipient addresses and amounts in a simple form",
              side: "right",
              align: "start",
            },
          },
          {
            element: "#csv",
            popover: {
              title: "Uploadify",
              description:
                "Effortless data management: Use Uploadify to seamlessly upload CSV files with recipient addresses and amounts for convenient editing on our platform",
              side: "right",
              align: "start",
            },
          },
        ],
      });
      driverObj.drive();
    }
  }, []);

  const renderComponent = (tab) => {
    switch (tab) {
      case "text":
        return <Textify />;
      case "create":
        return <Listify />;
      case "list":
        return <Uploadify />;
      default:
        return <Textify />;
    }
  };

  return (
    // <div className={`main-div-of-dashboard ${themeClass}`}>
    <div className={samechainStyle.maindivofdashboard}>
      <Navbar />
      <div style={{ position: "relative" }}>
        <Image className={samechainStyle.dashbgImg1} src={img3} alt="none" />
        <Image className={samechainStyle.dashbgImg2} src={img4} alt="none" />
      </div>
      <div className={samechainStyle.samedashmainm}>
        <div className={samechainStyle.titledivdashboard}>
          <div className={samechainStyle.imagesinthis}></div>
          <h1>Effortless Token Distribution</h1>
          <h3 className={samechainStyle.dashpera}>
            Instant Multi-Account Dispersement – Seamlessly Send Tokens to
            Multiple Accounts in One Click
          </h3>
        </div>
        <div className={samechainStyle.maindivforalloptiondashboard}>
          <div className={samechainStyle.menubardashboard}>
            <button
              // id={samechainStyle.view}
              id="view"
              className={activeTab === "text" ? `${samechainStyle.active}` : ""}
              onClick={() => setActiveTab("text")}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-custom-class="color-tooltip"
              // title="Paste or Type recipient addresses and amounts in one line!"
            >
              Textify
            </button>
            <button
              // id={samechainStyle.create}
              id="create"
              className={
                activeTab === "create" ? `${samechainStyle.active}` : ""
              }
              onClick={() => setActiveTab("create")}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-custom-class="color-tooltip"
              // title=" Fill recipient addresses and amounts in a simple form."
            >
              Listify
            </button>
            <button
              // id={samechainStyle.csv}
              id="csv"
              className={activeTab === "list" ? `${samechainStyle.active}` : ""}
              onClick={() => setActiveTab("list")}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-custom-class="color-tooltip"
              // title=" Upload CSV with recipient info using Uploadify for easy editing."
            >
              Uploadify
            </button>
          </div>
        </div>
        <div className={samechainStyle.divtocenterthecomponentrender}>
          <div className={samechainStyle.componentcontainerdashboard}>
            {renderComponent(activeTab)}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Samechaindashboard;
