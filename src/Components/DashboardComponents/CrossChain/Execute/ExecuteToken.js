import React, { useEffect, useState } from "react";
import { smartDisperseInstance } from "@/Helpers/ContractInstance";
import textStyle from "../Type/textify.module.css";
import contracts from "@/Helpers/ContractAddresses.js";
import { ethers } from "ethers";
import Modal from "react-modal";
import { approveToken } from "@/Helpers/ApproveToken";
import Image from "next/image";
import oopsimage from "@/Assets/oops.webp";
import bggif from "@/Assets/bp.gif";
import completegif from "@/Assets/complete.gif";
import confetti from "canvas-confetti";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPaperPlane,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useChainId, useNetwork } from "wagmi";

const ConfettiScript = () => (
  <Head>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.0.1/confetti.min.js"></script>
  </Head>
);

function ExecuteToken(props) {
  const [message, setMessage] = useState(""); //manage message to display in popup
  const [isModalIsOpen, setModalIsOpen] = useState(false); //Control modal visibility state
  const [success, setSuccess] = useState(false); //If transaction was successful or not
  const [paymentmodal, setPaymentmodal] = useState(false);
  const [limitexceed, setLimitexceed] = useState(null);
  const chainId = useChainId();

  const sendTweet = () => {
    console.log("tweeting");
    const tweetContent = `Just used @SmartDisperse to transfer to multiple accounts simultaneously across the same chain! Transferring to multiple accounts simultaneously has never been easier. Check out Smart Disperse at https://smartdisperse.xyz/ and simplify your crypto transfers today!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetContent
    )}`;
    window.open(twitterUrl, "_blank");
  };
  // Function to execute token transfer
  const execute = async () => {
    setPaymentmodal(true);
    // console.log(props.listData);
    props.setLoading(true);
    // console.log(props.ERC20Balance);
    // console.log(props.totalERC20);

    // Check if ERC20 balance is sufficient for transaction
    if (!props.ERC20Balance.gt(props.totalERC20)) {
      props.setLoading(false);
      setMessage(
        `Insufficient Token balance. Your Token Balance is ${(+ethers.utils.formatUnits(
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
      // Prepare recipients and values arrays
      var recipients = [];
      var values = [];
      for (let i = 0; i < props.listData.length; i++) {
        recipients.push(props.listData[i]["address"]);
        values.push(props.listData[i]["value"]);
      }
      // Check if token is approved

      const isTokenApproved = await approveToken(
        props.totalERC20,
        props.customTokenAddress,
        chainId
      );

      if (isTokenApproved) {
        try {
          const con = await smartDisperseInstance(chainId);
          // Execute token transfer
          const txsendPayment = await con.disperseToken(
            props.customTokenAddress,
            recipients,
            values
          );

          const receipt = await txsendPayment.wait();
          let blockExplorerURL = await getExplorer();
          props.setLoading(false);
          // console.log("yayy");
          setMessage(
            <div
            className={textStyle.Link}
              dangerouslySetInnerHTML={{
                __html: `Your Transaction was successful. Visit <a href="https://${blockExplorerURL}/tx/${receipt.transactionHash}" target="_blank">here</a> for details.`,
              }}
            />
          );
          // console.log("modal opening");
          setModalIsOpen(true);
          setSuccess(true);
          // console.log("success is true");
          // props.setListData([]);
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

  // Function to get explorer URL based on chain
  const getExplorer = async () => {
    return contracts[chainId]["block-explorer"];
  };

  useEffect(() => {
    if (success) {
      const count = 500,
        defaults = {
          origin: { y: 0.7 },
        };

      function fire(particleRatio, opts) {
        confetti(
          Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
          })
        );
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      fire(0.2, {
        spread: 60,
      });

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [success]); // Trigger confetti effect when success state changes

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
          <div>
            <Modal
              className={textStyle.popupforpayment}
              isOpen={paymentmodal}
              onRequestClose={() => setPaymentmodal(false)}
              contentLabel="Error Modal"
            >
              <h2>Please wait...</h2>
              <Image src={bggif.src} alt="not found" width={150} height={150} />
              <p>We are securely processing your payment.</p>
            </Modal>
          </div>
        ) : (
          "Begin Payment"
        )}
      </button>
      {/* Modal for displaying transaction status */}
      <Modal
        className={textStyle.popupforpayment}
        isOpen={isModalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Error Modal"
      >
        {message ? (
          <>
            <h2>
              {success
                ? "Woo-hoo! All your transactions have been successfully completed with just one click! 🚀"
                : "Something went Wrong..."}
            </h2>
            <div>
              {success ? (
                <div>
                  <Image
                    src={completegif}
                    alt="not found"
                    width={150}
                    height={150}
                  />
                  <p>{message}</p>
                  <div>
                    Why not extend the excitement? Invite your friends and
                    followers on Twitter to join in the joy. Broadcast your
                    seamless experience to the world. Click the tweet button
                    below and spread the cheer instantly! 🌐✨
                  </div>
                </div>
              ) : (
                <div>
                  <Image
                    src={oopsimage}
                    alt="not found"
                    width={150}
                    height={150}
                  />
                </div>
              )}
            </div>
            <p>{success ? "" : "Please Try again"}</p>
            <p className={textStyle.errormessagep}>{limitexceed}</p>
            <div className={textStyle.divtocenter}>
              <button style={{ margin: "0px 5px" }} onClick={sendTweet}>
                Tweet Now &nbsp; <FontAwesomeIcon icon={faPaperPlane} />
              </button>
              <button
                style={{ margin: "0px 5px" }}
                onClick={() => {
                  setModalIsOpen(false);
                  props.setListData([]);
                }}
              >
                Close &nbsp; <FontAwesomeIcon icon={faX} />
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
