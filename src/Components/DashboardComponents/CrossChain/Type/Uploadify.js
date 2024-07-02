"use client";

import React, { useState, useEffect } from "react";
import uploadStyle from "./uploadify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import textStyle from "@/Components/DashboardComponents/SameChain/Type/textify.module.css";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";
// import SendEth from "../Send/SendEth";
import { fetchUserLabels } from "@/Helpers/FetchUserLabels";
import { useAccount } from "wagmi";
import {
  faChevronDown,
  faChevronUp,
  faCirclePlus,
  faClipboardList,
  faDollarSign,
  faDoorOpen,
  faMagnifyingGlass,
  faPen,
  faRotate,
  faTag,
  faUpload,
  faUser,
  faUserLarge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";



function Uploadify({
  listData,
  setListData,
  tokenDecimal,
  allNames,
  allAddresses,
}) {
  const [csvData, setCsvData] = useState([]); // Stores the parsed CSV data
  const [isCsvDataEmpty, setIsCsvDataEmpty] =
    useState(true); /*True if csvData array is empty */
  const [allnames, setAllNames] = useState([]);
  const [alladdresses, setAllAddresses] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const {address} = useAccount();

  useEffect(() => {
    const firstVisit = Cookies.get("firstVisit");
    if (firstVisit === undefined) {
      setIsOpen(true);
      Cookies.set("firstVisit", "false", { expires: 365 });
    } else {
      setIsOpen(false);
    }
  }, []);
  const triggerSlide = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (address) {
      fetchUserDetails();
    }
  }, [address]);

  const isValidEthereumAddress = (str) => {
    return str.startsWith("0x");
  };

  useEffect(() => {
    if (address) {
      fetchUserDetails();
    }
  }, [address]);

  // Fetching all names and addresses stored in the database
  const fetchUserDetails = async () => {
    try {
      const { allNames, allAddress } = await fetchUserLabels(address);
      setAllNames(allNames);
      setAllAddresses(allAddress);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  /* Parses a given string content into an array of objects and returns it.*/
  const parseCSV = (content) => {
    const rows = content.split("\n");
    if (rows.length < 2) {
      alert("Invalid CSV format. Please check the CSV file.");
      return [];
    }

    const headers = rows[0].split(",").map((header) => header.trim());

    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",").map((item) => item.trim());

      if (row.length === headers.length) {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        data.push(rowData);
      }
    }

    return data;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;
      // console.log(content);
      try {
        const parsedData = parseCSV(content);

        if (parsedData) {
          // setCsvData(parsedData);
          // setIsCsvDataEmpty(parsedData.length === 0);
          console.log(parsedData);
          const listData = [];
          for (let i = 0; i < parsedData.length; i++) {
            if (tokenDecimal) {
              var validValue = isValidTokenValue(
                parsedData[i]["Token Amount"],
                tokenDecimal
              );
            } else {
              var validValue = isValidValue(parsedData[i]["Token Amount"]);
            }

            if (
              isValidAddress(parsedData[i]["Receiver Address"]) &&
              validValue
            ) {
              console.log("going in if");
              const recipientAddressFormatted =
                parsedData[i]["Receiver Address"].toLowerCase();
              const index = allAddresses.indexOf(recipientAddressFormatted);
              listData.push({
                address: parsedData[i]["Receiver Address"],
                value: validValue,
                label: allNames[index] ? allNames[index] : "",
              });
            } else if (
              !isValidAddress(parsedData[i]["Receiver Address"]) &&
              validValue
            ) {
              console.log("going in else if");
              const index = allNames.indexOf(parsedData[i]["Receiver Address"]);
              if (index !== -1) {
                let recAddress = allAddresses[index];
                listData.push({
                  address: recAddress,
                  value: validValue,
                  label: parsedData[i]["Receiver Address"],
                });
              }
            }
          }
          // console.log(listData);
          setListData(listData);
          // console.log("list data is set");
        } else {
          console.error("Parsed data is empty.");
        }
      } catch (error) {
        console.error("Error parsing CSV data:", error);
      }
    };

    reader.readAsText(file);
  };

  /* Validates all fields in each object of csvData array. Returns true if all are valid or false otherwise.*/
  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onload = async (e) => {
  //       const content = e.target.result;
  //       // console.log(content);
  //       try {
  //         const parsedData = parseCSV(content);

  //         if (parsedData) {
  //           setCsvData(parsedData);
  //           setIsCsvDataEmpty(parsedData.length === 0);
  //           // console.log(parsedData);
  //           const listData = [];
  //           for (let i = 0; i < parsedData.length; i++) {
  //             if (tokenDecimal) {
  //               var validValue = isValidTokenValue(
  //                 parsedData[i]["Token Amount"],
  //                 tokenDecimal
  //               );
  //             } else {
  //               var validValue = isValidValue(parsedData[i]["Token Amount"]);
  //             }

  //             if (
  //               isValidAddress(parsedData[i]["Receiver Address"]) &&
  //               validValue
  //             ) {
  //               listData.push({
  //                 address: parsedData[i]["Receiver Address"],
  //                 value: validValue,
  //               });
  //             }
  //           }
  //           // console.log(listData);
  //           setListData(listData);
  //           // console.log("list data is set");
  //         } else {
  //           console.error("Parsed data is empty.");
  //         }
  //       } catch (error) {
  //         console.error("Error parsing CSV data:", error);
  //       }
  //     };

  //     reader.readAsText(file);
  //   }
  // };

  // Function to handle form submission after validation checks
  const handleInputChange = (index, field, value) => {
    const updatedCsvData = [...csvData];
    updatedCsvData[index][field] = value;
    setListData(updatedCsvData);
  };

  // Add a new row to the csvData array and reset the input fields
  const updateListData = () => {
    const newListData = [];
    for (let i = 0; i < csvData.length; i++) {
      if (tokenDecimal) {
        var validValue = isValidTokenValue(
          csvData[i]["Token Amount"],
          tokenDecimal
        );
      } else {
        var validValue = isValidValue(csvData[i]["Token Amount"]);
      }

      if (isValidAddress(csvData[i]["Receiver Address"]) && validValue) {
        newListData.push({
          address: csvData[i]["Receiver Address"],
          value: validValue,
        });
      }
    }
    setListData(newListData);
  };

  // Update listData whenever csvData changes
  useEffect(() => {
    updateListData();
  }, [csvData]);

  return (
    <div>
         <div>
        <div className={textStyle.titlesametexttextarea} onClick={triggerSlide}>
          <h2
            className={textStyle.tutorialheading}
            style={{
              padding: "10px",
              fontSize: "20px",
              margin: "0px",
              letterSpacing: "1px",
              fontWeight: "300",
            }}
          >
            How it works{" "}
            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
          </h2>
        </div>
        {isOpen ? (
          <div
            id="Slider"
            className={`${textStyle.slider} ${
              isOpen ? textStyle.sliderOpen : ""
            }`}
          >
            <div>
              <ui
                style={{ listStyleType: "none" }}
                className={textStyle.contents}
              >
                <div
                  className={textStyle.tutorialcardscontainer}
                  style={{ textAlign: "left" }}
                >
                  <div className={textStyle.tutorialcards}>
                    <li className={textStyle.contentincard}>
                      <FontAwesomeIcon
                        className={textStyle.iconintutorial}
                        icon={faUser}
                      />
                      <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                        New Users
                      </div>
                      <div className={textStyle.subtextintutorial}>
                      Download the sample CSV for data order reference.
                      </div>
                    </li>
                  </div>
                  <div className={textStyle.tutorialcards}>
                    <li className={textStyle.contentincard}>
                      <FontAwesomeIcon
                        className={textStyle.iconintutorial}
                        icon={faRotate}
                      />

                      <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                      Auto-Fill Sync
                      </div>
                      <div className={textStyle.subtextintutorial}>
                      Enter address or label and amount. Auto-fills
                      </div>
                    </li>
                  </div>
                  <div className={textStyle.tutorialcards}>
                    <li className={textStyle.contentincard}>
                      <FontAwesomeIcon
                        className={textStyle.iconintutorial}
                        icon={faUpload}
                      />

                      <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                        Edit & Upload
                      </div>
                      <div className={textStyle.subtextintutorial}>
                      You can also edit and upload the sample CSV file.
                      </div>
                    </li>
                  </div>
                  <div className={textStyle.tutorialcards}>
                    <li className={textStyle.contentincard}>
                      <FontAwesomeIcon
                        className={textStyle.iconintutorial}
                        icon={faCirclePlus}
                      />

                      <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                        Label Assignment
                      </div>
                      <div className={textStyle.subtextintutorial}>
                        Input address and amount; assign label in transaction
                        lineup.
                      </div>
                    </li>
                  </div>
                </div>
              </ui>
            </div>
          </div>
        ) : null}
      </div>
      <div className={uploadStyle.titleforuploadfilecsvsame}>
        <h2
          style={{
            padding: "10px",
            fontSize: "20px",
            margin: "0px",
            fontWeight: "200",
            color:"rgb(202, 134, 255)",
            letterSpacing: "1px",
          }}
          className={uploadStyle.sametextmain}
        >
          Upload your Csv file which contains recipient Address and Token Amount
          or Download Sample CSV file
        </h2>
      </div>
      <div className={uploadStyle.uploadordownload}>
        <div className={uploadStyle.inputdivforcsv}>
          {/* <label>Upload File</label> &nbsp; &nbsp; */}
          <input
            className={uploadStyle.uploadFile}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>
        <div>
          <div>
            <a
              href="/SampleUpload.csv"
              download="SampleUpload.csv"
              className={uploadStyle.downloadbtn}
            >
              <button style={{ cursor: "pointer" }}>
                Download sample CSV file
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Uploadify;
