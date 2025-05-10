"use client";

import React, { useState, useEffect } from "react";
import { Notification, MessageText1, SearchNormal1 } from "iconsax-reactjs";
import { useDebounce } from "@/lib/hooks/useDebounce"; // see below for implementation

export const Header = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      console.log("Searching for:", debouncedSearch);
      // Perform search query or API call here
    }
  }, [debouncedSearch]);

  return (
    <header className="w-full flex justify-between items-center px-4 py-2 border-b border-stroke bg-main h-[74px] gap-4 lg:gap-[50px]">
      {/* Center: Search Bar */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <SearchNormal1
            size="18"
            className="text-gray-400"
            variant="Outline"
          />
        </div>
        <input
          type="text"
          placeholder="بحث..."
          className="w-full py-2 h-10 ps-10 pe-4 text-sm text-right border border-stroke rounded-lg focus:outline-none focus:ring-1 focus:ring-stroke bg-[#F8F9FA] dark:bg-black/80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Left: Notification and Message */}
      <div className="flex gap-4">
        <button className="relative w-10 h-10 flex items-center justify-center p-1 rounded-xl border">
          <Notification size="20" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <button className="relative w-10 h-10 flex items-center justify-center p-1 rounded-xl border">
          <MessageText1 size="20" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
      </div>
    </header>
  );
};
