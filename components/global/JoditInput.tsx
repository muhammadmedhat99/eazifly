"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface JoditInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const JoditInput: React.FC<JoditInputProps> = ({
  value,
  onChange,
  label,
  error,
  className = "col-span-3 mb-4",
}) => {
  const editor = useRef(null);

  return (
    <div className={className}>
      {label && (
        <label className="text-[#272727] font-bold text-sm mb-2 block">
          {label}
        </label>
      )}
      <div
        className={`border rounded-xl ${error ? "border-red-500" : "border-gray-300"} overflow-hidden`}
      >
        <JoditEditor
          ref={editor}
          value={value}
          config={{
            readonly: false,
            height: 300,
            language: "ar",
          }}
          onBlur={(newContent) => onChange(newContent)}
        />
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};
