"use client"
import feedbackStyle from "./feedbacksection.module.css";
import React, { useState, useEffect } from "react";

function Feedbacksection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isComponentVisible = sessionStorage.getItem("isComponentVisible");
    if (!isComponentVisible) {
      setIsVisible(true);
      sessionStorage.setItem("isComponentVisible", "true");
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.removeItem("isComponentVisible");
  };

  return (
    <>
      {isVisible && (
        <div className={feedbackStyle.maindivoffeedbacktile}>
          <div className={feedbackStyle.contentdiv}>
            Hey👋, Your feedback means the world to us Feedback or Report a bug
          </div>
          <div className={feedbackStyle.closebuttondiv}>
            <button onClick={handleClose}>X</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Feedbacksection;
