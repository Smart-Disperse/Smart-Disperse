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
  const [ethToUsdExchangeRate, setEthToUsdExchangeRate] = useState(null); //store ETH to USD exchange rate
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
    const lastAtSymbolIndex = textBeforeCursor.lastIndexOf("@");
    const updatedTextValue =
      textBeforeCursor.substring(0, lastAtSymbolIndex + 1) +
      suggestion +
      " " +
      textAfterCursor;
    setTextValue(updatedTextValue);
    setSuggestions([]);
    parseText(updatedTextValue);
  };

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        );
        const data = await response.json();
        const rate = data.USD;

        setEthToUsdExchangeRate(rate);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
  }, [listData]);

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
      const [recipientAddress, ...valueParts] = line.split(/[,= \t]+/);
      const recipientAddressFormatted = recipientAddress.toLowerCase();
      const value = valueParts.join(" "); // Rejoin value parts in case it contains spaces

      if (value) {
        let validValue;
        if (value.endsWith("$")) {
          // Remove the "$" sign from the value
          const numericValue = parseFloat(value.slice(0, -1));
          // Divide the numeric value by the USD exchange rate
          let convertedValue = numericValue / ethToUsdExchangeRate;
          // Round the converted value to 18 decimal places
          convertedValue = parseFloat(convertedValue.toFixed(18));
          console.log("Converted value:", convertedValue); // Log the converted value
          validValue = isValidValue(String(convertedValue)); // Convert to string
        } else if (tokenDecimal) {
          validValue = isValidTokenValue(value, tokenDecimal);
        } else {
          validValue = isValidValue(value);
        }

        // Check if validValue is false or invalid BigNumber string
        if (!validValue || validValue === "false") {
          // Log an error and skip this value
          console.error("Invalid value:", value);
          continue;
        }

        const index = allAddresses.indexOf(recipientAddressFormatted);
        if (isValidAddress(recipientAddressFormatted)) {
          updatedRecipients.push({
            address: recipientAddressFormatted,
            value: validValue,
            label: allNames[index] ? allNames[index] : "",
          });
        }
      }
    }

    console.log("Updated recipients:", updatedRecipients); // Log the updated recipients
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
