"use client";

import { Checkbox } from "@heroui/react";
import { useState, useEffect } from "react";

type PermissionCollapseProps = {
  title: string;
  permissions: string[];
};

export const PermissionCollapse = ({ title, permissions }: PermissionCollapseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);

  // حساب حالة تحديد الكل
  const isAllChecked = permissions.length > 0 && checkedPermissions.length === permissions.length;

  const togglePermission = (permission: string) => {
    setCheckedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const toggleAll = () => {
    if (isAllChecked) {
      setCheckedPermissions([]);
    } else {
      setCheckedPermissions([...permissions]);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden dark:bg-gray-900 bg-[#EAF0FD] outline outline-1 outline-offset-[-1px] outline-[#6792F1]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-4 py-3 text-right text-primary text-xs font-bold"
      >
        <span>{title}</span>
        <div className="flex items-center gap-2">
          <Checkbox checked={isAllChecked} onChange={toggleAll}>
            الكل
          </Checkbox>
          <svg
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {permissions.map((perm) => (
              <Checkbox
                key={perm}
                checked={checkedPermissions.includes(perm)}
                onChange={() => togglePermission(perm)}
              >
                {perm}
              </Checkbox>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
