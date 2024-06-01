import Cookies from "universal-cookie";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";

export const createSign = async (address, signature, message) => {
  try {
    const jwtToken = await decodeSignature(signature, message, address);

    if (jwtToken === null) {
      console.log("Error while decoding signature");
    } else {
      const storetoken = await storeToken(jwtToken);
      if (storetoken) {
        window.location.reload();
      }
    }
  } catch (e) {
    console.log("error", e);
  }
};

const decodeSignature = async (signature, message, address) => {
  try {
    // Decode the signature to get the signer's address
    const signerAddress = ethers.utils.verifyMessage(message, signature);

    if (signerAddress.toLowerCase() === address.toLowerCase()) {
      // Normalize addresses and compare them
      const jwtToken = generateJWTToken(signature, message);
      return jwtToken;
    }
    return null;
  } catch (e) {
    console.error("Error decoding signature:", e);
    return null;
  }
};

const generateJWTToken = (signature, message) => {
  // Set expiration time to 2 hrs from now
  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 2;

  const tokenPayload = {
    signature: signature,
    message: message,
    exp: expirationTime,
  };

  const token = jwt.sign(tokenPayload, "This is the msg for Jwt Token");
  return token;
};

const storeToken = async (token) => {
  const cookie = new Cookies();
  try {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24); // 24 hours
    // 1 hour * 60 minutes * 60 seconds * 1000 milliseconds
    cookie.set("jwt_token", token, { expires: expiryDate });
    return true;
  } catch (e) {
    console.error("Error storing token:", e);
    return false;
  }
};
