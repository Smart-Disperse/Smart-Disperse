import React, { useEffect, useState } from "react";
import { smartDisperseInstance } from "@/Helpers/ContractInstance";
import { getChain } from "@/Helpers/GetChain";
import textStyle from "../Type/textify.module.css";
import contracts from "@/Helpers/ContractAddresses.js";
import { ethers } from "ethers";
import Modal from "react-modal";
import { approveToken } from "@/Helpers/ApproveToken";

function ExecuteToken(props) {
  const [message, setMessage] = useState("");
  const [isModalIsOpen, setModalIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const execute = async () => {
    console.log(props.listData);
    props.setLoading(true);
    console.log(props.ERC20Balance);
    console.log(props.totalERC20);

    if (!props.ERC20Balance.gt(props.totalERC20)) {
      props.setLoading(false);
      setMessage(
        `Eth Limit Exceeded. Your Token Balance is ${(+ethers.utils.formatUnits(
          props.ERC20Balance,
          props.tokenDetails.decimal
        )).toFixed(4)} ${
          props.tokenDetails.symbol
        }   and you total sending Token amount is ${(+ethers.utils.formatUnits(
          props.totalERC20,
          props.tokenDetails.decimal
        )).toFixed(4)} ${props.tokenDetails.symbol} `
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

      const isTokenApproved = await approveToken(
        props.totalERC20,
        props.customTokenAddress
      );

      if (isTokenApproved) {
        try {
          const con = await smartDisperseInstance();
          const txsendPayment = await con.disperseToken(
            props.customTokenAddress,
            recipients,
            values
          );

          const receipt = await txsendPayment.wait();
          let blockExplorerURL = await getExplorer();

          props.setLoading(false);
          setMessage(
            <div
              dangerouslySetInnerHTML={{
                __html: `Your Transaction was successful. Visit <a href="https://${blockExplorerURL}/tx/${receipt.transactionHash}" target="_blank">here</a> for details.`,
              }}
            />
          );
          setModalIsOpen(true);
          props.setListData([]);
          setSuccess(true);
        } catch (e) {
          props.setLoading(false);
          console.log("error", e);
          setMessage("Transaction Rejected");
          setModalIsOpen(true);
          return;
        }
      } else {
        props.setLoading(false);
        setMessage("Approval Rejected");
        setModalIsOpen(true);
        return;
      }
    }
  };

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

export default ExecuteToken;
