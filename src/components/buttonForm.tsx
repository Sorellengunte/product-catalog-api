import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  variant?: "primary" | "danger";
};

export default function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
}: ButtonProps) {
  const styles = {
    primary: "btn-primary",
    danger: "btn-danger",
  };

  return (
    <button type={type} onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
}