import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

type inputSize = 'sm' | 'md' | 'lg';

const sizeStyles: Record<inputSize, string> = {
  sm: "w-48 h-8 text-sm p-1",
  md: "w-64 h-11 text-base p-4",
  lg: "w-72 h-12 text-lg p-5"
};

const sizeStyles_title: Record<inputSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl"
};

interface InputProps {
  type: string;
  size: inputSize;
  inputTitle?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const InputBox = ({
  type,
  size,
  inputTitle,
  placeholder,
  value,
  onChange,
  onKeyDown
}: Readonly<InputProps>) => {

 const [showPassword, setshowPassword] = useState(false);
 const isPassword = type === "password";
 let inputType = type;

 if (isPassword) {
  inputType = showPassword ? "text" : "password";
 }

  return (
    <div className="grid gap-0.5 mb-4">
      <span className={`${sizeStyles_title[size]} font-serif`}>
        {inputTitle}
      </span>

      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className={`${sizeStyles[size]} ${isPassword ? "pr-9" : ""} border rounded-lg`}
        />

        {isPassword && (
          <button 
            type="button" 
            onClick={() => setshowPassword(prev => !prev)} 
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}
      </div>
    </div>
  );
};