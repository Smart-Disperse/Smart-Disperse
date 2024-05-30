import React, { useState, useEffect, useRef } from "react";
import dropDownStyles from "./CustomDropdown.module.css";

function CustomDropdown({
  options,
  onSelect,
  selectedValue,
  placeholder,
  index,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  console.log(options);
  const handleSelect = (value) => {
    onSelect(value, index);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={dropDownStyles.dropdown} ref={dropdownRef}>
      <div
        className={dropDownStyles.dropdownHeader}
        onClick={() => setIsOpen(true)}
      >
        {console.log(selectedValue)}
        {selectedValue ? (
          <div className={dropDownStyles.selectedItem}>
            <img
              src={selectedValue.iconUrl}
              alt={selectedValue.name}
              className={dropDownStyles.icon}
            />
            {selectedValue.name}
          </div>
        ) : (
          <span>{placeholder}</span>
        )}
      </div>
      {isOpen && (
        <div className={dropDownStyles.dropdownList}>
          {options.map((option) => (
            <div
              key={option.name}
              className={dropDownStyles.dropdownItem}
              onClick={() => handleSelect(option)}
            >
              <img
                src={option.iconUrl}
                alt={option.name}
                className={dropDownStyles.icon}
              />
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
