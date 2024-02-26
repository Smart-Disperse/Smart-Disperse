"use client";
import React from "react";
import { useState } from "react";

import uploadStyle from "./uploadify.module.css";

function Uploadify({ listData, setListData }) {
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
              listData.push({
                receiverAddress: parsedData[i]["Receiver Address"],
                tokenAmount: parsedData[i]["Token Amount"],
              });
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

  return (
    <div>
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
  );
}

export default Uploadify;
