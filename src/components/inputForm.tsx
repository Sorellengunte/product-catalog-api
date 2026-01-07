import React, { forwardRef } from "react";

type InputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  toggleState?: boolean;
  error?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      placeholder,
      showToggle = false,
      onToggle,
      toggleState = false,
      error = false, 
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col">
        <label className="mb-1 font-medium">{label}</label>

        <div className="relative">
          <input
            ref={ref}
            type={showToggle && toggleState ? "text" : type}
            placeholder={placeholder}
            className={`w-full border rounded px-3 py-2 pr-16 focus:outline-none focus:ring ${
              error 
                ? "border-red-500 focus:ring-red-300" 
                : "border-black focus:ring-blue-300"
            } ${className}`}
            {...props}
          />

          {showToggle && onToggle && (
            <button
              type="button"
              onClick={onToggle}
              className="absolute right-2 top-2 text-blue-500 text-sm hover:text-blue-700"
            >
              {toggleState ? "Masquer" : "Voir"}
            </button>
          )}
        </div>
      </div>
    );
  }
);

// Pour le debugging dans React DevTools
Input.displayName = "Input";

export default Input;