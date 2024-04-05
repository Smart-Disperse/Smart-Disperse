"use client";
import Footer from "@/Components/Footer/Footer";
import Navbar from "@/Components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import displayuser from "./displayallusers.module.css";
import Image from "next/image";
import img3 from "../../Assets/img3-bg.webp";
import img4 from "@/Assets/img4-bg.webp";
import { useAccount } from "wagmi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  faPenToSquare,
  faCheck,
  faTrash,
  faXmark,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import loader from "../../Assets/dataloading.webp";
import notfound from "../../Assets/oops.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

function Displayallusers() {
  const [usersData, setUsersData] = useState([]);
  const [editUserIndex, setEditUserIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(true); // State for tracking loading
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  useEffect(() => {
    const handleClick = () => {
      if (!isConnected) {
        openConnectModal();
      }
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [isConnected, openConnectModal]);

  const fetchUserDetails = async () => {
    console.log(address);
    try {
      console.log("entered into try block");
      const result = await fetch(
        `http://localhost:3000/api/all-user-data?address=${address}`
      );
      const response = await result.json();
      console.log("Response from API:", response);
      const filteredData = response.result.filter(
        (user) => user.userid === address
      );
      console.log("Filtered data:", filteredData);
      setIsLoading(false);
      setUsersData(filteredData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleEdit = (index) => {
    setEditUserIndex(index);
    setEditName(usersData[index].name);
    setEditAddress(usersData[index].address);
  };

  const handleAbortedit = () => {
    setEditUserIndex(null);
    setEditName("");
    setEditAddress("");
  };

  const handleUpdate = async (index) => {
    try {
      console.log("entered into try block");
      const result = await fetch(`http://localhost:3000/api/all-user-data`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          address: editAddress,
        }),
      });
      console.log("result", result);
      console.log("edit address", editAddress, "editname:", editName);
      if (result.ok) {
        console.log("Data updated successfully");
        toast.success("Name updated successfully");
        const updatedUsersData = [...usersData];
        updatedUsersData[index] = {
          ...updatedUsersData[index],
          name: editName,
          address: editAddress,
        };
        setUsersData(updatedUsersData);
        // Clear edit state
        setEditUserIndex(null);
        setEditName("");
        setEditAddress("");
        fetchUserDetails();
      } else {
        console.error("Error updating user:", result.statusText);
        toast.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating data");
    }
  };

  const handleDelete = async (index) => {
    try {
      const addressToDelete = usersData[index].address;
      const result = await fetch(`http://localhost:3000/api/all-user-data`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: addressToDelete }),
      });
      if (result.ok) {
        console.log("Data deleted successfully");
        toast.success("Name deleted successfully");
        const updatedUsersData = [...usersData];
        updatedUsersData.splice(index, 1);
        setUsersData(updatedUsersData);
      } else {
        console.error("Failed to delete data");
        toast.error("Failed to delete data");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting data");
    }
  };

  const handleRefreshpage = () => {
    console.log("Reloading...");
    window.location.reload();
  };

  return (
    <div className={displayuser.maindivofdashboard}>
      <div style={{ position: "relative" }}>
        <Image className={displayuser.dashbgImg1} src={img3} alt="none" />
        <Image className={displayuser.dashbgImg2} src={img4} alt="none" />
      </div>
      <div className={displayuser.samedashmainm}>
        <div className={displayuser.titledivdashboard}>
          <div className={displayuser.imagesinthis}></div>
          <h1>Customize Your Connections</h1>
          <h3 className={displayuser.dashpera}>
            Edit and Delete Entries in a Snap for Effortless Data Management!"
          </h3>
        </div>

        <div className={displayuser.maindivforalloptiondashboard}>
          {isLoading ? (
            <div>
              <Image src={loader.src} alt="none" width={100} height={100} />
            </div>
          ) : usersData.length === 0 ? (
            <div>
              <Image src={notfound} alt="none" width={400} height={300} />
              <h2>No Data Found!!</h2>
              <h3>
                Please try again or{" "}
                <button
                  onClick={handleRefreshpage}
                  className={displayuser.refreshbtn}
                >
                  Refresh the page
                </button>
              </h3>
            </div>
          ) : (
            <div className={displayuser.displaydatatablewrapper}>
              <table className={displayuser.displaytable}>
                <thead>
                  <tr>
                    <th className={displayuser.displayheader}>Name</th>
                    <th className={displayuser.displayheader}>Address</th>
                    <th className={displayuser.displayheader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.map((user, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? `${displayuser.displayevenrow}`
                          : `${displayuser.displayoddrow}`
                      }
                    >
                      <td className={displayuser.displaycell}>
                        {editUserIndex === index ? (
                          <input
                            className={displayuser.editinput}
                            type="text"
                            value={editName}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Regular expression to allow only alphanumeric characters without spaces
                              const regex = /^[a-zA-Z0-9]*$/;
                              if (
                                inputValue.length <= 10 &&
                                regex.test(inputValue)
                              ) {
                                setEditName(inputValue);
                              }
                            }}
                          />
                        ) : (
                          user.name
                        )}
                      </td>
                      <td className={displayuser.displaycell}>
                        {user.address}
                      </td>
                      <td
                        style={{ display: "flex" }}
                        className={displayuser.displaycellbuttons}
                      >
                        {editUserIndex === index ? (
                          <div>
                            <button
                              className={displayuser.displayupdatebutton}
                              onClick={handleUpdate}
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                style={{ color: "#f5f9ff" }}
                              />
                            </button>
                            <button
                              className={displayuser.displayupdatebutton}
                              onClick={handleAbortedit}
                            >
                              <FontAwesomeIcon
                                icon={faXmark}
                                style={{ color: "#f5f9ff" }}
                              />
                            </button>
                          </div>
                        ) : (
                          <button
                            className={displayuser.displayeditbutton}
                            onClick={() => handleEdit(index)}
                          >
                            <FontAwesomeIcon
                              className={displayuser.editicon}
                              icon={faPenToSquare}
                              // style={{ color: "#ffffff" }}
                            />
                          </button>
                        )}
                        <button
                          className={displayuser.displaydeletebutton}
                          onClick={() => handleDelete(index)}
                        >
                          <FontAwesomeIcon
                            className={displayuser.deleteicon}
                            icon={faTrash}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ToastContainer />
            </div>
          )}
          <div className={displayuser.buttondivgoback}>
            <button className={displayuser.gobackbtn}>
              <FontAwesomeIcon icon={faArrowLeft} /> &nbsp;{" "}
              <Link className={displayuser.linkto} href={"/same-chain"}>
                Go to Same Chain Dashboard
              </Link>{" "}
            </button>
            <button className={displayuser.gobackbtn}>
              {" "}
              <Link className={displayuser.linkto} href={"/cross-chain"}>
                Go to Cross Chain Dashboard
              </Link>{" "}
              &nbsp; <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Displayallusers;
