"use client"
import feedbackStyle from "./feedbacksection.module.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";

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
            Hey👋, Your feedback means the world to us <Link
              target="_blank"
              className={feedbackStyle.feedbacklinks}
              href={`https://app.deform.cc/form/ecf6b6c2-bd2e-4fed-b631-1e0431265c5d`}
            >Feedback</Link>  or &nbsp;
            <Link
              target="_blank"
              className={feedbackStyle.feedbacklinks}
              href={`https://app.deform.cc/form/0a68c173-7f09-4b0f-b84e-0317ebfbab72`}
            >
             Report a bug
              </Link> 
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
