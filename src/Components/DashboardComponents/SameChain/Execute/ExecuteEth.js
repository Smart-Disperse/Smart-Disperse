import React, { useEffect, useState } from "react";
import { smartDisperseInstance } from "@/Helpers/ContractInstance";
import { getChain } from "@/Helpers/GetChain";
import textStyle from "../Type/textify.module.css";
import contracts from "@/Helpers/ContractAddresses.js";
import { ethers } from "ethers";
import Modal from "react-modal";

// Function to execute the Ethereum transaction
function ExecuteEth(props) {
  const [message, setMessage] = useState(""); //display the message in modal
  const [isModalIsOpen, setModalIsOpen] = useState(false); //control whether the modal is open or not
  const [success, setSuccess] = useState(false); //If transaction was successful or not

  const execute = async () => {
    console.log(props.listData);
    props.setLoading(true); //show loading spinner while executing the transaction
    console.log(props.ethBalance);
    console.log(props.totalEth);

    // Check if the Ethereum balance is sufficient for the transaction
    if (!props.ethBalance.gt(props.totalEth)) {
      props.setLoading(false);
      setMessage(
        `Eth Limit Exceeded. Your Eth Balance is ${(+ethers.utils.formatEther(
          props.ethBalance
        )).toFixed(
          9
        )}  ETH and you total sending Eth amount is ${(+ethers.utils.formatEther(
          props.totalEth
        )).toFixed(9)} ETH `
      );
      setModalIsOpen(true);
      return;
    } else {
      var recipients = [];
      var values = [];
      for (let i = 0; i < props.listData.length; i++) {
        recipients.push(props.listData[i]["address"]);
        values.push(props.listData[i]["value"]);
      }

      try {
        const con = await smartDisperseInstance();
        const txsendPayment = await con.disperseEther(recipients, values, {
          value: props.totalEth,
        });

        const receipt = await txsendPayment.wait();
        props.setLoading(false);

        let blockExplorerURL = await getExplorer();
        setMessage(
          <div
            dangerouslySetInnerHTML={{
              __html: `Your Transaction was successful. Visit <a href="https://${blockExplorerURL}/tx/${receipt.transactionHash}" target="_blank">here</a> for details.`,
            }}
          />
        );
        console.log("opening it sir");
        setModalIsOpen(true);
        setSuccess(true);
        console.log("Transaction receipt:", receipt);
      } catch (error) {
        props.setLoading(false);
        setMessage(`Transaction cancelled.`);
        setModalIsOpen(true);
        setSuccess(false);
        console.error("Transaction failed:", error);
      }
    }
  };

  // Function to get the block explorer URL
  const getExplorer = async () => {
    const chainId = await getChain();
    return contracts[chainId]["block-explorer"];
  };

  return (
    <div>
      {" "}
      <button
        id={textStyle.greenbackground}
        className={textStyle.sendbutton}
        onClick={() => {
          execute();
        }}
        disabled={props.loading}
      >
        {props.loading ? (
          <div className={textStyle.loader}></div>
        ) : (
          "Begin Payment"
        )}
      </button>
      {/* Modal for displaying success or failure message of transaction */}
      <Modal
        className={textStyle.popupforpayment}
        isOpen={isModalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Error Modal"
      >
        {message ? (
          <>
            <h2>{success ? "Congratulations!!" : "Error"}</h2>
            <p>{message}</p>
            <div className={textStyle.divtocenter}>
              <button
                onClick={
                  (() => setModalIsOpen(false), () => props.setListData([]))
                }
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Notice</h2>
            {/* <p>{alertMessage}</p> */}
            <div className={textStyle.divtocenter}>
              <button onClick={() => setModalIsOpen(false)}>Close</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export default ExecuteEth;
