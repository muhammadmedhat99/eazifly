"use client";

import { Button, Checkbox } from "@heroui/react";
import { useEffect, useState } from "react";

type PermissionCollapseProps = {
  title: string;
  permissions: string[];
  defaultChecked?: string[];
  onChange?: (updatedPermissions: string[]) => void;
};

export const PermissionCollapse = ({
  title,
  permissions,
  defaultChecked = [],
  onChange,
}: PermissionCollapseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>([]);

  useEffect(() => {
    setCheckedPermissions(defaultChecked);
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange(checkedPermissions); 
    }
  }, [checkedPermissions]);

  const isAllChecked =
    permissions.length > 0 &&
    permissions.every((perm) => checkedPermissions.includes(`${title}_${perm}`));

  return (
    <div className="rounded-lg overflow-hidden dark:bg-gray-900 bg-[#EAF0FD] outline outline-1 outline-offset-[-1px] outline-[#6792F1]">
      <div className="flex justify-between items-center w-full px-4 py-3 text-right text-primary text-xs font-bold">
        <span>{title}</span>
        <div className="flex items-center gap-4">

          <Checkbox
            isSelected={isAllChecked}
            onValueChange={(selected) => {
              setCheckedPermissions((prev) => {
                if (selected) {
                  const groupPermissions = permissions.map((perm) => `${title}_${perm}`);
                  return Array.from(new Set([...prev, ...groupPermissions]));
                } else {
                  return prev.filter((p) => !permissions.some((perm) => p === `${title}_${perm}`));
                }
              });
            }}
          >
            الكل
          </Checkbox>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {permissions.map((perm) => {
              const permKey = `${title}_${perm}`;
              const isSelected = checkedPermissions.includes(permKey);

              return (
                <Checkbox
                  key={permKey}
                  isSelected={isSelected}
                  onValueChange={(selected) => {
                    setCheckedPermissions((prev) => {
                      if (selected) {
                        return [...prev, permKey];
                      } else {
                        return prev.filter((p) => p !== permKey);
                      }
                    });
                  }}
                >
                  {perm}
                </Checkbox>


              );
            })}


          </div>
        </div>
      )}
    </div>
  );
};
