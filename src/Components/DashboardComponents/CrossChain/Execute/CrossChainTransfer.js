"use client";
import React, { useEffect, useState } from "react";
import textStyle from "../Type/textify.module.css";
import { ethers } from "ethers";
import Modal from "react-modal";
import Image from "next/image";
import oopsimage from "@/Assets/oops.webp";
import bggif from "@/Assets/tnxloader.gif";
import completegif from "@/Assets/complete.gif";
// import completegif from "@/Assets/congoimg.gif";
import confetti from "canvas-confetti";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faPaperPlane,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useChainId, useNetwork } from "wagmi";
import { smartDisperseCrossChainInstance } from "@/Helpers/CrosschainHelpers/ContractInstance";
import crossContracts from "@/Helpers/CrosschainHelpers/Contractaddresses";
import { approveToken } from "@/Helpers/CrosschainHelpers/CrossApproveToken";
import allchains from "@/Helpers/CrosschainHelpers/ChainSelector";

const ConfettiScript = () => (
  <Head>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.0.1/confetti.min.js"></script>
  </Head>
);

function CrossChainTransfer(props) {
  const [message, setMessage] = useState("");
  const [executionStatusmodal, setExecutionStatusmodal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loaderModal, setLoadermodal] = useState(false);
  const [limitexceed, setLimitexceed] = useState(null);
  const [tweetModalIsOpen, setTweetModalIsOpen] = useState(false); // New state for tweet modal
  const chainId = useChainId();

  const sendTweet = () => {
    console.log("tweeting");
    const tweetContent = `Just used @SmartDisperse to transfer to multiple accounts simultaneously across the same chain! Transferring to multiple accounts simultaneously has never been easier. Check out Smart Disperse at https://smartdisperse.xyz?utm_source=twitter_tweet&utm_medium=social&utm_campaign=smart_disperse&utm_id=002 and simplify your crypto transfers today!`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetContent
    )}`;
    window.open(twitterUrl, "_blank");
  };

  useEffect(() => {
    const calculateGasFees = async () => {
      const mergedData = {};
      props.listData.forEach((item, index) => {
        const chainName = props.selectedDestinationfinalChains[index]?.name;
        if (chainName) {
          const receiverAddress =
            allchains[chainId]["destinationChains"][chainName].receiverAddress;
          const chainSelector =
            allchains[chainId]["destinationChains"][chainName].chainSelector;

          if (!mergedData[chainName]) {
            mergedData[chainName] = {
              receiverAddress,
              chainSelector,
              list: [],
            };
          }

          mergedData[chainName].list.push(item);
        }
      });

      console.log(mergedData);
      const receiverAddresses = [];
      const chainSelectors = [];
      const amounts = [];
      const addresses = [];

      for (const chainName in mergedData) {
        if (Object.hasOwnProperty.call(mergedData, chainName)) {
          const chainData = mergedData[chainName];
          receiverAddresses.push(chainData.receiverAddress);
          chainSelectors.push(chainData.chainSelector);

          // Extracting amounts and addresses
          const amountArr = [];
          const addressArr = [];
          chainData.list.forEach((item) => {
            amountArr.push(item.value);
            addressArr.push(item.address);
          });
          amounts.push(amountArr);
          addresses.push(addressArr);
        }
      }

      console.log(" Chain Selectors:", chainSelectors);
      console.log(" Receiver Addresses:", receiverAddresses);
      console.log(" Amounts:", amounts);
      console.log(" Addresses:", addresses);
      console.log(props.tokenAddress);
      const con = await smartDisperseCrossChainInstance(chainId);
      const paymentData = {
        paymentReceivers: addresses,
        amounts: amounts,
      };
      try {
        const estimatedfees = await con.getEstimatedFees(
          chainSelectors,
          receiverAddresses,
          paymentData,
          props.tokenAddress
        );
        console.log("estimated fees:", estimatedfees);
        props.setshowestimatedgasprice(estimatedfees);
      } catch (error) {
        console.log("error:", error);
      }
    };

    calculateGasFees();
  }, [props.totalERC20]);

  const execute = async () => {
    setLoadermodal(true);

    if (!props.ERC20Balance.gt(props.totalERC20)) {
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
      setExecutionStatusmodal(true);
      return;
    } else {
      console.log(props.listData, props.selectedDestinationfinalChains);

      const mergedData = {};
      props.listData.forEach((item, index) => {
        const chainName = props.selectedDestinationfinalChains[index]?.name;
        if (chainName) {
          const receiverAddress =
            allchains[chainId]["destinationChains"][chainName].receiverAddress;
          const chainSelector =
            allchains[chainId]["destinationChains"][chainName].chainSelector;

          if (!mergedData[chainName]) {
            mergedData[chainName] = {
              receiverAddress,
              chainSelector,
              list: [],
            };
          }

          mergedData[chainName].list.push(item);
        }
      });

      console.log(mergedData);
      const receiverAddresses = [];
      const chainSelectors = [];
      const amounts = [];
      const addresses = [];

      for (const chainName in mergedData) {
        if (Object.hasOwnProperty.call(mergedData, chainName)) {
          const chainData = mergedData[chainName];
          receiverAddresses.push(chainData.receiverAddress);
          chainSelectors.push(chainData.chainSelector);

          // Extracting amounts and addresses
          const amountArr = [];
          const addressArr = [];
          chainData.list.forEach((item) => {
            amountArr.push(item.value);
            addressArr.push(item.address);
          });
          amounts.push(amountArr);
          addresses.push(addressArr);
        }
      }

      console.log(" Chain Selectors:", chainSelectors);
      console.log(" Receiver Addresses:", receiverAddresses);
      console.log(" Amounts:", amounts);
      console.log(" Addresses:", addresses);
      console.log(props.tokenAddress);
      console.log(props.totalERC20);

      const con = await smartDisperseCrossChainInstance(chainId);
      console.log(chainId);
      try {
        const isTokenApproved = await approveToken(
          props.totalERC20,
          props.tokenAddress,
          chainId
        );
        console.log(isTokenApproved);
        console.log("Token Approved");
      } catch (error) {
        console.log("error:", error);
      }

      const paymentData = {
        paymentReceivers: addresses,
        amounts: amounts,
      };
      try {
        const estimatedfees = await con.getEstimatedFees(
          chainSelectors,
          receiverAddresses,
          paymentData,
          props.tokenAddress
        );
        console.log("estimated fees:", estimatedfees);
        console.log(props.totalERC20);
        console.log("Transaction Started");
        const txsendPayment = await con.sendMessagePayNative(
          chainSelectors,
          receiverAddresses,
          paymentData,
          props.tokenAddress,
          {
            value: estimatedfees,
          }
        );
        console.log("Transaction Successful");
        const receipt = await txsendPayment.wait();
        console.log(receipt);

        let blockExplorerURL = await getExplorer();
        setMessage(
          <div
            className={textStyle.Link}
            dangerouslySetInnerHTML={{
              __html: `Your Transaction was successful. Visit <a href="https://${blockExplorerURL}/tx/${receipt.transactionHash}" target="_blank "   style={{ color: "white", textDecoration: "none" }}>here</a> for details.`,
            }}
          />
        );
        setExecutionStatusmodal(true);
        setSuccess(true);
        console.log(txsendPayment);
      } catch (error) {
        console.log("error", error);
        setMessage(`Transaction cancelled.`);
        setExecutionStatusmodal(true);
        setSuccess(false);
      }
    }
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
  }, [success]);

  const getExplorer = async () => {
    return "ccip.chain.link";
  };

  return (
    <div>
      {" "}
      <button
        id={textStyle.greenbackground}
        className={`${textStyle.sendbutton} `}
        onClick={() => {
          execute();
        }}
        disabled={!props.suffecientBalance}
      >
        <>
          {props.suffecientBalance ? "Begin payment" : "Insufficient balance"}
        </>
      </button>
      <div>
        <Modal
         style={{
          overlay: {
            backgroundColor: "transparent"
          },
        }}
          className={textStyle.popupforpayment}
          isOpen={loaderModal}
          onRequestClose={() => setLoadermodal(false)}
          contentLabel="Error Modal"
        >
          <h2>Please wait...</h2>
          <Image src={bggif.src} alt="not found" width={150} height={150} />
          <p>We are securely processing your payment.</p>
        </Modal>
      </div>
      <Modal
       style={{
        overlay: {
          backgroundColor: "transparent"
        },
      }}
        className={textStyle.popupforpayment}
        isOpen={executionStatusmodal}
        onRequestClose={() => setExecutionStatusmodal(false)}
        contentLabel="Error Modal"
      >
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
                  seamless experience to the world. Click the tweet button below
                  and spread the cheer instantly! 🌐✨
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

          <div className={textStyle.divtocenter}>
            {success ? (
              <button style={{ margin: "0px 5px" }} onClick={sendTweet}>
                Tweet Now &nbsp; <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            ) : (
              ""
            )}
            <button
              style={{ margin: "0px 5px" }}
              onClick={() => {
                setExecutionStatusmodal(false);
                props.setListData([]);
              }}
            >
              Close &nbsp; <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </>
      </Modal>
    </div>
  );
}

export default CrossChainTransfer;
