"use client";
import React from "react";
import { useState, useEffect } from "react";
import listStyle from "./listify.module.css";
import { isValidAddress } from "@/Helpers/ValidateInput.js";
import { isValidValue } from "@/Helpers/ValidateInput.js";
import { isValidTokenValue } from "@/Helpers/ValidateInput.js";
import Modal from "react-modal";
import textStyle from "./textify.module.css";
import oopsimage from "@/Assets/oops.webp";
import Image from "next/image";
import { useAccount } from "wagmi";

function Listify({ listData, setListData, tokenDecimal }) {
  const { address } = useAccount();

  const [formData, setFormData] = useState({
    address: "",
    value: "",
    label: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); //error in model
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); //model switch
  const [LabelModelIsOpen, setLabelModelIsOpen] = useState(false); //model switch
  const [label, setLabel] = useState(""); //model switch

  const [allNames, setAllNames] = useState([]);
  const [allAddresses, setAllAddresses] = useState([]);

  // Function to close the error modal
  const closeErrorModal = () => {
    // console.log("clicked");
    setErrorModalIsOpen(false);
    setErrorMessage("");
    // console.log("modal open");
  };

  const handleReceiverAddressChange = (event) => {
    const receiverAddress = event.target.value;

    const index = allAddresses.findIndex(
      (n) => n === receiverAddress.toLowerCase()
    );
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
      }); // Only reset the address if the name is not found
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

    // Find the index of the entered name in the allNames array (case-insensitive)
    const index = allNames.findIndex((n) => n === enteredName);
    if (index !== -1) {
      setFormData({
        ...formData,
        address: allAddresses[index],
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

  const handleAddClick = async () => {
    // console.log("checking");
    const isvalid = await validateFormData();
    console.log(formData);
    if (isvalid) {
      if (formData.label === "") {
        setLabelModelIsOpen(true);
      } else {
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
    }
  };

  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const onAddLabel = async (isAdd) => {
    if (isAdd) {
      formData.label = label;

      console.log(address);
      const userData = {
        userid: address,
        name: formData.label,
        address: formData.address.toLowerCase(),
      };
      console.log(userData);
      try {
        console.log("entered into try block");
        let result = await fetch(`http://localhost:3000/api/all-user-data`, {
          method: "POST",
          body: JSON.stringify(userData),
        });

        console.log(result);
        result = await result.json();
        console.log("Result after submission:", result);
        if (result.success) {
          alert("Added to MongoDB");
        }
      } catch (error) {
        console.error("Error:", error);
      }

      await fetchUserDetails();
    }
    setListData([...listData, formData]);
    setFormData({
      address: "",
      value: "",
      label: "",
    });
    localStorage.removeItem("address");
    localStorage.removeItem("value");
    localStorage.removeItem("label");
    setLabel("");

    setLabelModelIsOpen(false);
  };

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

      console.log("Names:", names);
      console.log("Addresses:", addresses);

      setAllNames(names);
      setAllAddresses(addresses);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
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
            // style={{ color: "black" }}
            // className={`each-input-of-create-list token-input ${themeClass}`}
            className={`${listStyle["eachinputofcreatelist"]} ${listStyle["tokeninput"]}`}
            type="text"
            name="value"
            value={formData.label}
            placeholder="Enter name"
            onChange={handleNameChange}
          />
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

        <Modal
          className={textStyle.popupforpayment}
          isOpen={LabelModelIsOpen}
          // onRequestClose={() => setLabelModelIsOpen(false)}
          contentLabel="Label Prompt Modal"
        >
          <>
            <h2>Do you wish to add a label for the address?</h2>
            <p></p>
            <input
              type="text"
              placeholder="Enter Label"
              value={label}
              onChange={handleLabelChange}
            />
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => onAddLabel(true)}>Add Label</button>
              <button onClick={() => onAddLabel(false)}>Skip</button>
            </div>
          </>
        </Modal>
      </>
    </div>
  );
}

export default Listify;
