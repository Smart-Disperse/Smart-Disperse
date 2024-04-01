"use client";

import ConnectButtonCustom from "@/Components/ConnectButton/ConnectButtonCustom";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Page() {
  const { address } = useAccount();
  const [name, setName] = useState("");
  const [waddress, setAddress] = useState("");
  const [userData, setUserData] = useState([]);
  const [fetchUserId, setFetchUserId] = useState(""); // Initialize with the current user's address

  const handleSubmit = async () => {
    console.log(address);
    const userData = {
      userid: address,
      name: name,
      address: waddress,
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
        setName("");
        setAddress("");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFetchUserDetails = async () => {
    try {
      const result = await fetch(`http://localhost:3000/api/all-user-data`);
      const response = await result.json();
      console.log("Response from API:", response);
      const usersData = response.result;
      console.log(usersData);
      console.log("fetchuserid", fetchUserId);
      if (Array.isArray(usersData)) {
        const matchingUsers = usersData.filter(
          (user) => user.userid === address
        );
        if (matchingUsers.length > 0) {
          console.log("Matching users found:", matchingUsers);
          setUserData(matchingUsers);
        } else {
          console.log("No matching users found.");
          setUserData([]);
        }
      } else {
        console.error("Invalid data format received from API.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <ConnectButtonCustom />
      </div>
      <div className="text-center">
        <div className="text-3xl my-20">User Data Form</div>
        <div className="flex flex-col items-center">
          <input
            className="border-2 border-gray-900 rounded-md my-5"
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border-2 border-gray-900 rounded-md my-5"
            type="text"
            placeholder="Enter Address"
            value={waddress}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            className="border-2 border-gray-900 rounded-md p-1.5"
            onClick={handleSubmit}
          >
            Submit Data
          </button>
        </div>

        <div className="mt-10 flex justify-center items-center">
          {/* <h2 className="text-xl font-bold">Fetch User Details</h2> */}
          <div style={{ display: "none" }} className="flex items-center">
            <input
              className="border-2 border-gray-900 rounded-md my-5"
              type="text"
              placeholder="Enter User ID to fetch details"
              value={address} // Use fetchUserId here
              onChange={(e) => setFetchUserId(e.target.value)}
            />
          </div>
          <button
            className="border-2 border-gray-900 rounded-md p-1.5 ml-2"
            onClick={handleFetchUserDetails}
          >
            Fetch Details
          </button>
        </div>

        {userData.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold">User Data:</h2>
            <ul type="orderlist">
              {userData.map((user, index) => (
                <li key={index}>
                  <div className="flex ">
                    <p className="m-6">Name: {user.name}</p>
                    <p className="m-6">Address: {user.address}</p>{" "}
                  </div>
                  {/* Use user.address instead of user.waddress */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
