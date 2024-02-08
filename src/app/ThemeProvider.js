"use client";
import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const themeClass = isDarkMode ? "dark-theme" : "light-theme";

  return (
    <ThemeContext.Provider value={{ toggleDarkMode, themeClass }}>
      {children}
    </ThemeContext.Provider>
  );
};
