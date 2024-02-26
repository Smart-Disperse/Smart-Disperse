"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import uploadStyle from "./uploadify.module.css";

function Uploadify({ listData, setListData, tokenDecimal }) {
  const [csvData, setCsvData] = useState([]);
  const [isCsvDataEmpty, setIsCsvDataEmpty] = useState(true);

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

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const content = e.target.result;
        console.log(content);
        try {
          const parsedData = parseCSV(content);

          if (parsedData) {
            setCsvData(parsedData);
            setIsCsvDataEmpty(parsedData.length === 0);
            console.log(parsedData);
            const listData = [];
            for (let i = 0; i < parsedData.length; i++) {
              if (tokenDecimal) {
                var validValue = isValidTokenValue(
                  parsedData[i]["Token Amount"]
                );
              } else {
                var validValue = isValidValue(parsedData[i]["Token Amount"]);
              }

              if (
                isValidAddress(parsedData[i]["Receiver Address"]) &&
                validValue
              ) {
                listData.push({
                  address: parsedData[i]["Receiver Address"],
                  value: validValue,
                });
              }
            }
            console.log(listData);
            setListData(listData);
            console.log("list data is set");
          } else {
            console.error("Parsed data is empty.");
          }
        } catch (error) {
          console.error("Error parsing CSV data:", error);
        }
      };

      reader.readAsText(file);
    }
  };

  /*
  Funtion : for checking if it is an EOA address
  */
  const isValidAddress = (address) => ethers.utils.isAddress(address);

  /*
  Funtion : for checking if the value is in correct format and 
  can be added to the listData for transaction lineup
  */
  const isValidValue = (value) => {
    try {
      // regex to check if the value starts from digits 0-9
      if (!/^\d/.test(value)) {
        value = value.slice(1);
      }
      return ethers.utils.parseUnits(value, "ether");
    } catch (err) {
      // console.log(err);
      return false;
    }
  };

  const isValidTokenValue = (value) => {
    try {
      // regex to check if the value starts from digits 0-9
      if (!/^\d/.test(value)) {
        value = value.slice(1);
      }
      return ethers.utils.parseUnits(value, tokenDecimal);
    } catch (err) {
      // console.log(err);
      return false;
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedCsvData = [...csvData];
    updatedCsvData[index][field] = value;
    setCsvData(updatedCsvData);
  };

  const updateListData = () => {
    const newListData = [];
    for (let i = 0; i < csvData.length; i++) {
      if (tokenDecimal) {
        var validValue = isValidTokenValue(csvData[i]["Token Amount"]);
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

  useEffect(() => {
    // Update listData whenever csvData changes
    updateListData();
  }, [csvData]);

  return (
    <div>
      {/* Render input fields for each address and value pair */}
      {csvData.map((rowData, index) => (
        <div key={index}>
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
                ? isValidTokenValue(rowData["Token Amount"])
                  ? uploadStyle.normal
                  : uploadStyle.red
                : isValidValue(rowData["Token Amount"])
                ? uploadStyle.normal
                : uploadStyle.red
            }
          />
        </div>
      ))}

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
              href="/Book2.csv"
              download="Book2.csv"
              className={uploadStyle.downloadbtn}
            >
              <button>Download sample CSV file</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Uploadify;
