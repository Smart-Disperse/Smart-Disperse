"use client";
import React from "react";
import { useState, useEffect } from "react";
import listStyle from "./listify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";

function Listify({ listData, setListData, tokenDecimal }) {
  const [formData, setFormData] = useState({
    address: "",
    value: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); //error in model
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); //model switch

  const handleReceiverAddressChange = (event) => {
    setFormData({
      ...formData,
      address: event.target.value,
    });
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

  const validateFormData = async () => {
    var address = formData.address;
    var amount = formData.value;
    if (!/^\d/.test(amount)) {
      amount = amount.slice(1);
    }

    if (!isValidValue(amount) && !isValidAddress(address)) {
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

    return true;
  };

  const handleAddClick = async () => {
    const isvalid = await validateFormData();
    console.log(listData);
    if (isvalid) {
      setListData([...listData, formData]);
      setFormData({
        address: "",
        value: "",
      });
      localStorage.removeItem("address");
      localStorage.removeItem("value");
    }
  };

  const handleDeleteRow = (index) => {
    const updatedList = [...listData];
    updatedList.splice(index, 1);
    setListData(updatedList);
  };
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
          <lable
            className={listStyle.inputflexlistlabel}
            style={{ width: "25%" }}
          ></lable>
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
    </div>
  );
}

export default Listify;
