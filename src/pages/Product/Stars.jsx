
import React from "react";
import { FaStar } from "react-icons/fa";

const Stars = ({ value = 0, size = "text-base", onChange, editable = false }) => {
  const handleClick = (index) => {
    if (editable && onChange) onChange(index + 1);
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`${size} cursor-${editable ? "pointer" : "default"} ${
            i < value ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => handleClick(i)}
        />
      ))}
    </div>
  );
};

export default Stars;
