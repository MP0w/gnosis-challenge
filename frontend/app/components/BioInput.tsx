import { InputHTMLAttributes, ReactNode } from "react";

interface BioInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error: string | undefined;
  children: ReactNode;
}

export function BioInput({ label, error, id, children }: BioInputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
