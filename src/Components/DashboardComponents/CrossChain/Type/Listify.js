"use client";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import listStyle from "./listify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";
import Modal from "react-modal";
import textStyle from "./textify.module.css";
import oopsimage from "@/Assets/oops.webp";
import Image from "next/image";

function Listify({
  listData,
  setListData,
  tokenDecimal,
  allNames,
  allAddresses,
}) {
  const [formData, setFormData] = useState({
    address: "",
    value: "",
    label: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); //error in model
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); //model switch
  // const [LabelModelIsOpen, setLabelModelIsOpen] = useState(false); //model switch
  // const [label, setLabel] = useState(""); //model switch
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); 
  const dropdownRef = useRef(null)
  // Function to close the error modal
  const closeErrorModal = () => {
    // console.log("clicked");
    setErrorModalIsOpen(false);
    setErrorMessage("");
    // console.log("modal open");
  };

  const handleReceiverAddressChange = (event) => {
    const receiverAddress = event.target.value.toLowerCase();
  
    const index = allAddresses.findIndex((n) => n === receiverAddress);
    if (index !== -1) {
      setFormData({
        ...formData,
        address: receiverAddress,
        label: allNames[index],
      });
    } else {
      setFormData({
        ...formData,
        address: receiverAddress,
        label: "",
      });
    }
  };
  
  const handleValueInputChange = (e) => {
    const { name, value } = e.target;

    // Regular expression to allow numeric and decimal values
    const validInputRegex = /^\d*\.?\d*$/;

    if (validInputRegex.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNameChange = (e) => {
    const enteredName = e.target.value.toLowerCase();
    console.log(enteredName); // Convert entered name to lowercase
  // Find suggestions based on the entered name
  const filteredSuggestions = allNames.filter((name) =>
    name.toLowerCase().includes(enteredName)
  );
  setNameSuggestions(filteredSuggestions);
    // Find the index of the entered name in the allNames array (case-insensitive)
    const index = allNames.findIndex((n) => n === enteredName);
    if (index !== -1) {
      setFormData({
        ...formData,
        address: allAddresses[index],
        // address: enteredName,
        label: enteredName,
      });
    } else {
      setFormData({
        ...formData,
        label: enteredName,
        address: "",
      }); // Only reset the address if the name is not found
    }
  };

  const handleNameSuggestionClick = (suggestion) => {
    setFormData({
      ...formData,
      label: suggestion,
    });
    setNameSuggestions([]);
  };

  const validateFormData = async () => {
    var address = formData.address;
    var amount = formData.value;
    if (!/^\d/.test(amount)) {
      amount = amount.slice(1);
    }

    if (!isValidValue(amount) && !isValidAddress(address)) {
      // console.log("Invalid address");
      setErrorMessage("Incorrect details");
      setErrorModalIsOpen(true);
      return false;
    }

    if (!isValidValue(amount)) {
      setErrorMessage("Invalid Eth Value");
      setErrorModalIsOpen(true);
      return false;
    }
    if (!isValidAddress(address)) {
      setErrorMessage("Invalid recipient Address");
      setErrorModalIsOpen(true);
      return false;
    }
    if (tokenDecimal) {
      formData.value = isValidTokenValue(amount, tokenDecimal);
    } else {
      formData.value = isValidValue(amount);
    }
    // console.log("here");
    return true;
  };

    // Function to close the suggestion dropdown
    const closeSuggestions = () => {
      setNameSuggestions([]);
    };
  
    // Event listener to handle Escape key press
    useEffect(() => {
      const handleEscapeKeyPress = (e) => {
        if (e.key === "Escape") {
          closeSuggestions();
        }
      };
  
      document.addEventListener("keydown", handleEscapeKeyPress);
  
      return () => {
        document.removeEventListener("keydown", handleEscapeKeyPress);
      };
    }, []);
  
    // Event listener to handle click outside the suggestion dropdown
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          closeSuggestions();
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

 
  useEffect(() => {
    // Scroll the dropdown container to keep the selected suggestion in view
    if (dropdownRef.current && selectedIndex !== -1) {
      const selectedElement = dropdownRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e) => {
    if (nameSuggestions.length > 0) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : nameSuggestions.length - 1
        );
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < nameSuggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "Enter" && selectedIndex !== -1) {
        handleNameSuggestionClick(nameSuggestions[selectedIndex]);
      }
    }
  };
  const handleAddClick = async () => {
    // console.log("checking");
    const isvalid = await validateFormData();
    console.log(formData);
    if (isvalid) {
      setListData([...listData, formData]);
      setFormData({
        address: "",
        value: "",
        label: "",
      });
      localStorage.removeItem("address");
      localStorage.removeItem("value");
      localStorage.removeItem("label");
    }
  };

  useEffect(() => {
    const index = allNames.findIndex((name) => name === formData.label);
    if (index !== -1) {
      setFormData({
        ...formData,
        address: allAddresses[index],
      });
    } else {
      setFormData({
        ...formData,
        address: "",
      });
    }
  }, [formData.label]);
  
  
  return (
    <div className={listStyle.divinsamecreatelisttokenload}>
      <div className={listStyle.enteraddressdivtitle}>
        <h2
          style={{
            fontWeight: "700",
            padding: "10px",
            fontSize: "20px",
            margin: "0px",
            letterSpacing: "1px",
            fontWeight: "700",
          }}
          className={listStyle.enteraddressdivtitleh2}
        >
          Enter the Recipient Address and Token Amount{" "}
        </h2>
      </div>
      <div style={{ padding: "30px 20px" }}>
        <div className={listStyle.inputflexlist}>
          <label>Enter Name </label>
          <input
  className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
  type="text"
  name="value"
  value={formData.label}
  placeholder="Enter name"
  onChange={handleNameChange}
  onKeyDown={handleKeyDown}
/>
{nameSuggestions.length > 0 && (
    <div ref={dropdownRef} className={listStyle.listdropdown}>
      {nameSuggestions.map((suggestion, index) => (
        <div
          key={index}
          style={{
            backgroundColor: index === selectedIndex ? "#49058eed" : "#49058e91" 
          }}
          className={`${listStyle.listdropdownItem} ${
            index === selectedIndex ? listStyle.selected : ""
          }`} // Apply selected class if index matches selectedIndex
          onClick={() => handleNameSuggestionClick(suggestion)}
        >
          {suggestion}
        </div>
      ))}
  </div>
)}
        </div>

        <div className={listStyle.inputflexlist}>
          <label className={listStyle.enteraddressdivtitlelabel}>
            Enter Receiver Address:{" "}
          </label>
          <input
            // id="blue-div"
            // className={`each-input-of-create-list token-input ${themeClass}`}
            className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
            type="text"
            name="receiverAddress"
            value={formData.address}
            placeholder="0x9b4716573622751e7F6a56da251D054b6BBa4B00"
            onChange={handleReceiverAddressChange}
          />
        </div>
        <div className={listStyle.inputflexlist}>
          <label>Enter Token Amount: </label>
          <input
            // style={{ color: "black" }}
            // className={`each-input-of-create-list token-input ${themeClass}`}
            className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
            type="text"
            name="value"
            value={formData.value}
            placeholder="0.50"
            onChange={handleValueInputChange}
          />
        </div>

        <div className={listStyle.inputflexlist}>
          <label
            className={listStyle.inputflexlistlabel}
            style={{ width: "25%" }}
          ></label>
          <button
            id={listStyle.addtolistbuttonid}
            className={`${listStyle["buttontoaddformdata"]} ${listStyle["maddtolist"]}}`}
            onClick={handleAddClick}
            style={{ width: "45%" }}
          >
            Add to List
          </button>
        </div>
      </div>
      <>
        <Modal
          className={textStyle.popupforpayment}
          isOpen={errorModalIsOpen}
          onRequestClose={() => setErrorModalIsOpen(false)}
          contentLabel="Error Modal"
        >
          <>
            <h2>Oops...</h2>
            <p>Something went Wrong,</p>
            <div>
              {/* <Image src={oopsimage} alt="not found" /> */}
              <Image
                height={150}
                width={150}
                src={oopsimage.src}
                alt="not found"
              />
            </div>
            <p className={textStyle.errormessagep}>{errorMessage}</p>

            <div className={textStyle.divtocenter}>
              <button onClick={closeErrorModal}>Close</button>
            </div>
          </>
        </Modal>
       
      </>
    </div>
  );
}

export default Listify;
