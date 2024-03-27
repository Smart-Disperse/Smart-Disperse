"use client";

import React, { useState, useEffect } from "react";
import uploadStyle from "./uploadify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";
import SendEth from "../Send/SendEth";

function Uploadify({ listData, setListData, tokenDecimal }) {
  const [csvData, setCsvData] = useState([]); // Stores the parsed CSV data
  const [isCsvDataEmpty, setIsCsvDataEmpty] =
    useState(true); /*True if csvData array is empty */
    const [allnames, setAllNames] = useState([]);
    const [alladdresses, setAllAddresses] = useState([]);
    const [matchedData, setMatchedData] = useState([]);
    const [labels, setLabels] = useState([]);
  
    const isValidEthereumAddress = (str) => {
      return str.startsWith("0x");
    };
  
    useEffect(() => {
      fetchUserDetails();
    }, []);
  
    // Fetching all names and addresses stored in the database
    const fetchUserDetails = async () => {
      try {
        const result = await fetch(`http://localhost:3000/api/all-user-data`);
        const response = await result.json();
        console.log("Response from API:", response);
  
        const usersData = response.result;
        const names = usersData.map((user) =>
          user.name ? user.name.toLowerCase() : ""
        );
        const addresses = usersData.map((user) =>
          user.address ? user.address.toLowerCase() : ""
        );
        setAllNames(names);
        setAllAddresses(addresses);
        console.log("Names:", names);
        console.log("Addresses:", addresses);
     
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

    reader.onload = (e) => {
      const content = e.target.result;
      const rows = content.split('\n').map(row => row.split(','));
      // setListData(rows);
      console.log(rows);

      console.log("checking");
      // Check for Ethereum addresses and names in the first column
      if (rows.length > 1) { // Check if there's at least one row of data
        const matchedDataArray = [];
        const addressesInCsv = [];
        for (let i = 1; i < rows.length; i++) {
          const cell = rows[i][0]; // Get the value in the first column
          if (isValidEthereumAddress(cell)) {
            console.log("Ethereum Address:", cell);
          } else if (cell.startsWith("@")) {
            const formattedName = cell.substring(1); // Remove "@" symbol
            console.log("Name:", formattedName);
            // Check if the formatted name is matched with any name in allnames
            const index = allnames.indexOf(formattedName.toLowerCase());
            if (index !== -1) {
              console.log("Matched Address:", alladdresses[index]);
              matchedDataArray.push({ address: alladdresses[index], value: rows[i][1], name: formattedName });
              // Replace "@" prefixed name with its corresponding address in the CSV data
              rows[i][0] = alladdresses[index];
            }
          } else if (isValidEthereumAddress(cell)) {
            addressesInCsv.push(cell);
          }
        }
        setMatchedData(matchedDataArray);
        // Combine the addresses from the CSV file and the matched addresses
const allAddresses = [...new Set([...addressesInCsv, ...matchedDataArray.map(item => item.address)])];
console.log("All Addresses:", allAddresses);
// Update the rows to include address, value, and name
rows.forEach((row, rowIndex) => {
  if (rowIndex > 0) { // Exclude header row
    if (isValidEthereumAddress(row[0])) {
      // Include the corresponding name in the second column
      row.push(allnames[alladdresses.indexOf(row[0])]);
    } else {
      // Include the combined addresses in the first column
      row[0] = allAddresses.join(',');
      // Include the value in the second column
      row.push(row[1]);
      // Include the name in the third column
      row.push(row[2]);
    }
  }
});
      }
      // Update the CSV data state with modified rows
      // setCsvData(rows);
      setListData(rows);
      console.log(rows); //here all the data of the transaction lineup table are stored
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
      {/* Render input fields for each address and value pair */}
      {/* {csvData.map((rowData, index) => (
        <div key={index}>
          <div>yoooooooooooooooooooooooooooooooooo</div>
          <input
            type="text"
            value={rowData["Receiver Address"]}
            onChange={(e) =>
              handleInputChange(index, "Receiver Address", e.target.value)
            }
            className={
              isValidAddress(rowData["Receiver Address"])
                ? uploadStyle.normal
                : uploadStyle.red
            }
          />
          <input
            type="text"
            value={rowData["Token Amount"]}
            onChange={(e) =>
              handleInputChange(index, "Token Amount", e.target.value)
            }
            className={
              tokenDecimal
                ? isValidTokenValue(rowData["Token Amount"], tokenDecimal)
                  ? uploadStyle.normal
                  : uploadStyle.red
                : isValidValue(rowData["Token Amount"])
                ? uploadStyle.normal
                : uploadStyle.red
            }
          />
        </div>
      ))} */}
      <div className={uploadStyle.titleforuploadfilecsvsame}>
        <h2
          style={{
            padding: "10px",
            fontSize: "20px",
            margin: "0px",
            fontWeight: "700",
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
        <SendEth listData={listData}
        setListData={setListData}/>;
      </div>
    </div>
  );
}

export default Uploadify;
