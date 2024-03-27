"use client"
import React, { useState, useEffect } from 'react';

function Page() {
  const [csvData, setCsvData] = useState([]);
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const rows = content.split('\n').map(row => row.split(','));
      setCsvData(rows);
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
      setCsvData(rows);
      console.log(rows); //here all the data of the transaction lineup table are stored
    };

    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-4">
      <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      <table className="table-auto w-full">
        <tbody>
          {csvData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border px-4 py-2">
                  {/* Render a button in empty cells */}
                  {cell === "" || cell == undefined ? (
                    // <button onClick={() => handleAddButtonClick(rowIndex, cellIndex)}>Add</button>
                    <input
                    style={{border:"1px solid black"}}
                    type="text"
                    // value={labels[index] ? labels[index] : ""}
                    value={labels}
                    onChange={(e) => {
                      setLabels( e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        console.log("Adding Label:",labels);
                      }
                    }}/>
                  ) : (
                    cell
                  )}
                </td>
              ))}
              {/* Add the "Always Label" header in the last column */}
              {rowIndex === 0 && (
                <td key="always-label" className="border px-4 py-2">Always Label</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
}

export default Page;
