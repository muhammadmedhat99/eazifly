"use client";

import dynamic from "next/dynamic";
import type { StylesConfig } from "react-select"; // ✅ Safe static import of types

const Select = dynamic(() => import("react-select"), { ssr: false });

export { StylesConfig };
export default Select;
