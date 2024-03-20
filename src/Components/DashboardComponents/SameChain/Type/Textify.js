"use client";
import React, { useState, useEffect } from "react";
import textStyle from "./textify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";
import { useAccount } from "wagmi";

/*
Funtion :Storing value for more personalization
*/
// const useLocalStorage = (key, initialValue = "") => {
//   const [value, setValue] = useState(() => {
//     const storedValue = localStorage.getItem(key);
//     return storedValue !== null ? storedValue : initialValue;
//   });
//   useEffect(() => {
//     localStorage.setItem(key, value);
//   }, [key, value]);

//   return [value, setValue];
// };

function Textify({
  listData,
  setListData,
  tokenDecimal,
  allNames,
  allAddresses,
}) {
  // const [textValue, setTextValue] = useLocalStorage("textValue", "");
  const [textValue, setTextValue] = useState("");
  const { address } = useAccount();

  /*
  Funtion : for parsing and validation the value received from user Input and store
  it in our desired format for Showing in Transaction Lineup
  */
  const parseText = async (textValue) => {
    let updatedRecipients = [];
    const resolveRegex = /@(\w+)\s/g;
    let newTextValue = textValue.replace(resolveRegex, (match, name) => {
      const index = allNames.indexOf(name);
      if (index !== -1) {
        return allAddresses[index] + " ";
      }
      return match;
    });

    console.log(newTextValue);
    setTextValue(newTextValue);
    const lines = newTextValue.split("\n").filter((line) => line.trim() !== "");
    lines.forEach(async (line) => {
      const [recipientAddress, value] = line.split(/[,= \t]+/);
      const recipientAddressFormatted = recipientAddress.toLowerCase();
      if (value) {
        if (tokenDecimal) {
          var validValue = isValidTokenValue(value, tokenDecimal);
          console.log("go", validValue);
        } else {
          var validValue = isValidValue(value);
        }
      }

      const index = allAddresses.indexOf(recipientAddressFormatted);
      if (isValidAddress(recipientAddressFormatted) && validValue) {
        updatedRecipients.push({
          address: recipientAddressFormatted,
          value: validValue,
          label: allNames[index] ? allNames[index] : "",
        });
      }
    });

    console.log(updatedRecipients);
    await setListData(updatedRecipients);
  };

  // useEffect(() => {
  //   fetchUserDetails();
  // }, []);

  // const fetchUserDetails = async () => {
  //   try {
  //     const result = await fetch(`http://localhost:3000/api/all-user-data?address=${address}`);
  //     const response = await result.json();
  //     console.log("Response from API:", response);

  //     const usersData = response.result;
  //     const names = usersData.map((user) =>
  //       user.name ? user.name.toLowerCase() : ""
  //     );
  //     const addresses = usersData.map((user) =>
  //       user.address ? user.address.toLowerCase() : ""
  //     );
  //     console.log("Names:", names);
  //     setAllNames(names);
  //     console.log("Addresses:", addresses);
  //     setAllAddresses(addresses);
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //   }
  // };

  /*
  UseEffect :For updating user Input in the textbox for adding  Recipient address and value
  */

  useEffect(() => {
    parseText(textValue);
  }, [textValue]);

  return (
    <div>
      <div className={textStyle.divtocoversametextdi}>
        <div>
          <div id="textify-input" className={textStyle.textlistdiv}>
            <div className={textStyle.titlesametexttextarea}>
              <h2
                style={{
                  padding: "10px",
                  fontSize: "20px",
                  margin: "0px",
                  letterSpacing: "1px",
                  fontWeight: "700",
                }}
              >
                Enter Recipients and Amount (enter one address and amount on
                each line, supports any format)
              </h2>
            </div>
            <div id="tt">
              <textarea
                spellCheck="false"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "10px",
                  border: "none",
                  background: "#e6e6fa",
                  color: "black",
                  fontSize: "16px",
                  fontFamily: "Arial, sans-serif",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
                className={textStyle.textareaInput}
                placeholder="0xe57f4c84539a6414C4Cf48f135210e01c477EFE0=1.41421 
                  0xe57f4c84539a6414C4Cf48f135210e01c477EFE0 1.41421
                  0xe57f4c84539a6414C4Cf48f135210e01c477EFE0,1.41421"
              ></textarea>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              paddingRight: "25px",
              paddingBottom: "10px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Textify;
