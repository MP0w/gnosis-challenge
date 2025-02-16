import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger";
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle = "text-white font-bold py-2 px-4 rounded";
  const variantStyles = {
    primary: "bg-blue-500 hover:bg-blue-700",
    danger: "bg-red-500 hover:bg-red-700",
  };

  return (
    <button
      {...props}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
    />
  );
}
