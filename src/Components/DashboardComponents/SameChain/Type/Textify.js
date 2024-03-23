import React, { useState, useEffect, useRef } from "react";
import textStyle from "./textify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";
import { useAccount } from "wagmi";

function Textify({
  listData,
  setListData,
  tokenDecimal,
  allNames,
  allAddresses,
}) {
  const [textValue, setTextValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const textareaRef = useRef(null);
  const { address } = useAccount();

  const handleInputChange = (e) => {
    const { value } = e.target;
    setTextValue(value);
    if (value.includes("@")) {
      const searchTerm = value.split("@").pop().toLowerCase();
      const filteredSuggestions = allNames.filter((name) =>
        name.toLowerCase().includes(searchTerm)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
    parseText(value);
  };
  const handleSuggestionClick = (suggestion) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = textValue.substring(0, cursorPosition);
    const textAfterCursor = textValue.substring(cursorPosition);
    const updatedTextValue =
      textBeforeCursor.replace(/@(\w+)$/, '') + `@${suggestion} ` + textAfterCursor;
    setTextValue(updatedTextValue);
    setSuggestions([]);
    parseText(updatedTextValue);
  };
  
  

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
    for (const line of lines) {
      const [recipientAddress, value] = line.split(/[,= \t]+/);
      const recipientAddressFormatted = recipientAddress.toLowerCase();
      if (value) {
        let validValue;
        if (tokenDecimal) {
          validValue = isValidTokenValue(value, tokenDecimal);
          console.log("go", validValue);
        } else {
          validValue = isValidValue(value);
        }
  
        const index = allAddresses.indexOf(recipientAddressFormatted);
        if (isValidAddress(recipientAddressFormatted) && validValue) {
          updatedRecipients.push({
            address: recipientAddressFormatted,
            value: validValue,
            label: allNames[index] ? allNames[index] : "",
          });
        }
      }
    }
  
    console.log(updatedRecipients);
    await setListData(updatedRecipients);
  };
  
  
  

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
            <div id="tt" style={{ position: "relative" }}>
              <textarea
                ref={textareaRef}
                spellCheck="false"
                value={textValue}
                onChange={handleInputChange}
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
              {suggestions.length > 0 && (
                <div className={textStyle.dropdown}>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={textStyle.dropdownItem}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
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