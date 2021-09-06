import React, { FC } from "react";

interface Props {
  className?: string;
  disabled?: boolean;
  onClick?: () => any;
}

const Button: FC<Props> = ({ className, disabled, onClick, children }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`px-2 py-1 border
      text-black bg-white
      dark:text-white dark:bg-black
      ${disabled ? "opacity-50 cursor-default" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
