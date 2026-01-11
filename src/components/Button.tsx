import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Button({ type = "button", onClick, children, className = "" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`py-3 rounded-lg font-semibold transition ${className}`}
    >
      {children}
    </button>
  );
}
