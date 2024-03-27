"use client";
import React, { useState, useEffect } from "react";
import Displayallusers from "./Displayallusers";
import Loading from "../loading";

function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return typeof window !== "undefined" ? (
    <div>{loading ? <Loading /> : <Displayallusers />}</div>
  ) : null;
}

export default Page;
