import { ethers } from "ethers";

/*
  Funtion : for checking if it is an EOA address
  */
export const isValidAddress = (address) => ethers.utils.isAddress(address);

/*
  Funtion : for checking if the value is in correct format and 
  can be added to the listData for transaction lineup
  */
export const isValidValue = (value) => {
  try {
    // regex to check if the value starts from digits 0-9
    if (!/^\d/.test(value)) {
      value = value.slice(1);
    }
    if (+value > 0) {
      return ethers.utils.parseUnits(value, "ether");
    }
    return false;
  } catch (err) {
    // console.log(err);
    return false;
  }
};

export const isValidTokenValue = (value, tokenDecimal) => {
  try {
    // regex to check if the value starts from digits 0-9
    if (!/^\d/.test(value)) {
      value = value.slice(1);
    }
    if (+value > 0) {
      return ethers.utils.parseUnits(value, tokenDecimal);
    }

    return false;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
