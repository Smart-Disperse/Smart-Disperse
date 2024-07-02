import React, { useState, useEffect, useRef } from "react";
import textStyle from "./textify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";
import { useAccount } from "wagmi";
import {
  faChevronDown,
  faChevronUp,
  faCirclePlus,
  faClipboardList,
  faDollarSign,
  faDoorOpen,
  faHandHoldingDollar,
  faMagnifyingGlass,
  faPen,
  faTag,
  faUserLarge,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
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
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1); // Define focusedSuggestionIndex state variable
  const textareaRef = useRef(null);
  const [suggestionItemHeight, setSuggestionItemHeight] = useState(0);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    const firstVisit = Cookies.get("firstVisit");
    if (firstVisit === undefined) {
      setIsOpen(true);
      Cookies.set("firstVisit", "false", { expires: 365 }); // Set the cookie to expire in 1 year
    } else {
      setIsOpen(false);
    }
  }, []);

  const triggerSlide = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setTextValue(value);
    if (value.includes("@")) {
      const searchTerm = value.split("@").pop().toLowerCase();
      const filteredSuggestions = allNames?.filter((name) =>
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

    // Find the index of the first non-whitespace character after the inserted address
    const nextNonWhitespaceIndex = updatedTextValue.indexOf(
      /\S/,
      lastAtSymbolIndex + suggestion.length + 2
    );

    // Calculate the new cursor position
    const updatedCursorPosition =
      nextNonWhitespaceIndex !== -1
        ? nextNonWhitespaceIndex
        : updatedTextValue.length;

    setTextValue(updatedTextValue);
    setSuggestions([]);

    // Set the cursor position after the inserted address
    textareaRef.current.focus(); // Ensure the textarea is focused before setting the cursor position
    textareaRef.current.setSelectionRange(
      updatedCursorPosition,
      updatedCursorPosition
    );

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
        if (allAddresses[index]) {
          return allAddresses[index] + " ";
        }
      }
      return match;
    });

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
          // Log the converted value
          validValue = isValidValue(String(convertedValue)); // Convert to string
        } else if (tokenDecimal) {
          validValue = isValidTokenValue(value, tokenDecimal);
        } else {
          validValue = isValidValue(value);
        }

        // Check if validValue is false or invalid BigNumber string
        if (!validValue || validValue === "false") {
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

    await setListData(updatedRecipients);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = focusedSuggestionIndex + (e.key === "ArrowUp" ? -1 : 1);

      if (
        newIndex >= 0 && newIndex < suggestions.length ? suggestions.length : 0
      ) {
        setFocusedSuggestionIndex(newIndex);

        // Calculate the scroll position
        const dropdownElement = dropdownRef.current;
        const scrollTop = newIndex * suggestionItemHeight;
        dropdownElement.scrollTop = scrollTop;
      }
    } else if (e.key === "Enter" && focusedSuggestionIndex !== -1) {
      // Check if "@" is present in the input text
      if (textValue.includes("@")) {
        e.preventDefault(); // Prevent the default Enter behavior
        handleSuggestionClick(suggestions[focusedSuggestionIndex]);
      }
    }
  };

  useEffect(() => {
    // Calculate suggestion item height when suggestions change
    const suggestionElement = dropdownRef.current?.firstChild;
    if (suggestionElement) {
      setSuggestionItemHeight(suggestionElement.offsetHeight);
    }
  }, [suggestions]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedSuggestionIndex, suggestions]);

  const handleSuggestionMouseEnter = (index) => {
    setFocusedSuggestionIndex(index);
  };

  const handleSuggestionMouseLeave = () => {
    setFocusedSuggestionIndex(-1);
  };

  return (
    <div>
      <div className={textStyle.divtocoversametextdi}>
        <div>
          <div>
            <div
              className={textStyle.titlesametexttextarea}
              onClick={triggerSlide}
            >
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
                            icon={faDoorOpen}
                          />
                          <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                            Direct Entry
                          </div>
                          <div className={textStyle.subtextintutorial}>
                            Enter Ethereum addresses and amounts in Ether or
                            USD.
                          </div>
                        </li>
                      </div>
                      <div className={textStyle.tutorialcards}>
                        <li className={textStyle.contentincard}>
                          <FontAwesomeIcon
                            className={textStyle.iconintutorial}
                            icon={faHandHoldingDollar}
                          />

                          <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                            Currency Indicator
                          </div>
                          <div className={textStyle.subtextintutorial}>
                            Use a dollar sign ($) for USD; Ether amounts without
                            a symbol.
                          </div>
                        </li>
                      </div>
                      <div className={textStyle.tutorialcards}>
                        <li className={textStyle.contentincard}>
                          <FontAwesomeIcon
                            className={textStyle.iconintutorial}
                            icon={faMagnifyingGlass}
                          />

                          <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                            Label Lookup
                          </div>
                          <div className={textStyle.subtextintutorial}>
                            Type "@" to access assigned labels; select or type
                            "@labelname".
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
                            Input address and amount; assign label in
                            transaction lineup.
                          </div>
                        </li>
                      </div>
                    </div>
                  </ui>
                </div>
              </div>
            ) : null}
          </div>
          <div id="textify-input" className={textStyle.textlistdiv}>
            <div className={textStyle.titlesametexttextarea}>
              <h2
                style={{
                  padding: "10px",
                  fontSize: "20px",
                  margin: "0px",
                  letterSpacing: "1px",
                  fontWeight: "300",
                  lineHeight: "25px",
                }}
              >
                Enter Recipients and Amount (enter one address and amount on
                each line, supports any format)
              </h2>
            </div>
            <div id="tt" style={{ position: "relative", height: "150px" }}>
              <textarea
                ref={textareaRef}
                spellCheck="false"
                value={textValue}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  minHeight: "125px",
                  padding: "10px",
                  border: "none",
                  background: "#e6e6fa",
                  color: "black",
                  fontSize: "16px",
                  fontFamily: "Arial, sans-serif",
                  boxSizing: "border-box",
                  resize: "vertical",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#6b8e23 transparent",
                }}
                className={`${textStyle.textareaInput} custom-scrollbar`}
                placeholder="@Justin/0xe57f4c84539a6414C4Cf48f135210e01c477EFE0 1.41421"
              ></textarea>
              {suggestions?.length > 0 && (
                <div
                  ref={dropdownRef}
                  className={textStyle.dropdown}
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`${textStyle.dropdownItem} ${
                        index === focusedSuggestionIndex
                          ? textStyle.dropdownItemActive
                          : ""
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => handleSuggestionMouseEnter(index)}
                      onMouseLeave={handleSuggestionMouseLeave}
                      style={{
                        background:
                          index === focusedSuggestionIndex
                            ? "#8f00ff"
                            : "white",
                        color:
                          index === focusedSuggestionIndex
                            ? "white"
                            : "#8f00ff",
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <div
              className={textStyle.titlesametexttextarea}
              onClick={triggerSlide}
            >
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
                            icon={faDoorOpen}
                          />
                          <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                            Direct Entry
                          </div>
                          <div className={textStyle.subtextintutorial}>
                            Enter Ethereum addresses and amounts in Ether or
                            USD.
                          </div>
                        </li>
                      </div>
                      <div className={textStyle.tutorialcards}>
                        <li className={textStyle.contentincard}>
                          <FontAwesomeIcon
                            className={textStyle.iconintutorial}
                            icon={faDollarSign}
                          />

                          <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                            Currency Indicator
                          </div>
                          <div className={textStyle.subtextintutorial}>
                            Use a dollar sign ($) for USD; Ether amounts without
                            a symbol.
                          </div>
                        </li>
                      </div>
                      <div className={textStyle.tutorialcards}>
                        <li className={textStyle.contentincard}>
                          <FontAwesomeIcon
                            className={textStyle.iconintutorial}
                            icon={faTag}
                          />

                          <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                            Label Lookup
                          </div>
                          <div className={textStyle.subtextintutorial}>
                            Type "@" to access assigned labels; select or type
                            "@labelname".
                          </div>
                        </li>
                      </div>
                      <div className={textStyle.tutorialcards}>
                        <li className={textStyle.contentincard}>
                          <FontAwesomeIcon
                            className={textStyle.iconintutorial}
                            icon={faClipboardList}
                          />

                          <div style={{ color: "#00FBFB", fontWeight: "300" }}>
                            Label Assignment
                          </div>
                          <div className={textStyle.subtextintutorial}>
                            Input address and amount; assign label in
                            transaction lineup.
                          </div>
                        </li>
                      </div>
                    </div>
                  </ui>
                </div>
              </div>
            ) : null}
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
