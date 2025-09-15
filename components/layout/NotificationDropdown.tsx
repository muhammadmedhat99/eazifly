"use client";

import { Notification } from "iconsax-reactjs";
import { useState, useEffect, useRef } from "react";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: "رسالة جديدة", description: "لديك رسالة من أحمد", time: "منذ 5 دقائق" },
    { id: 2, title: "تحديث", description: "تم تحديث حسابك بنجاح", time: "أمس" },
    { id: 3, title: "رسالة جديدة", description: "لديك رسالة من أحمد", time: "منذ 5 دقائق" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 flex items-center justify-center p-1 rounded-xl border"
      >
        <Notification size="20" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-72 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b font-semibold text-gray-700">الإشعارات</div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-sm text-gray-900">{n.title}</div>
                  <div className="text-xs text-gray-500">{n.description}</div>
                  <div className="text-[10px] text-gray-400">{n.time}</div>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-center text-gray-500 text-sm">
                لا توجد إشعارات حالياً
              </li>
            )}
          </ul>
          <div className="p-2 border-t text-center text-sm text-primary cursor-pointer hover:bg-gray-50">
            عرض الكل
          </div>
        </div>
      )}
    </div>
  );
}
