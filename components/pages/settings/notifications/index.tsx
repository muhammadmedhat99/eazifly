"use client";

import React, { useState } from "react";
import { Switch } from "@heroui/react";
import { Warning2 } from "iconsax-reactjs";

export const Notifications = () => {
    const [notifyByEmail, setNotifyByEmail] = useState(true);
    const [notifyByWhatsapp, setNotifyByWhatsapp] = useState(false);

    const [cases, setCases] = useState({
        newUser: false,
        newOrder: true,
        emailSent: false,
    });

    const toggleCase = (key: string) => {
        setCases((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    return (
        <div className="relative p-5 flex flex-col gap-8">
            {/* Overlay يغطي كله */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 rounded-2xl z-10">
                <Warning2 size="40" color="#f59e0b" variant="Bold" />
                <span className="mt-2 text-2xl font-bold text-gray-700">
                    Coming Soon
                </span>
            </div>

            {/* Notification Method */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-6 flex flex-col gap-6">
                <h2 className="font-semibold text-lg text-gray-700">
                    طريقة استلام الإشعارات
                </h2>
                <div className="flex flex-col sm:flex-row gap-6">
                    <Switch
                        size="lg"
                        isSelected={notifyByEmail}
                        onValueChange={setNotifyByEmail}
                    >
                        إيميل
                    </Switch>

                    <Switch
                        size="lg"
                        isSelected={notifyByWhatsapp}
                        onValueChange={setNotifyByWhatsapp}
                    >
                        واتساب
                    </Switch>
                </div>
            </div>

            {/* Notification Cases */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-6 flex flex-col gap-6">
                <h2 className="font-semibold text-lg text-gray-700">
                    الحالات التي يُرسَل فيها إشعار
                </h2>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <span>عند تسجيل مستخدم جديد</span>
                        <Switch
                            isSelected={cases.newUser}
                            onValueChange={() => toggleCase("newUser")}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span>عند إنشاء طلب جديد</span>
                        <Switch
                            isSelected={cases.newOrder}
                            onValueChange={() => toggleCase("newOrder")}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span>عند إرسال بريد إلكتروني</span>
                        <Switch
                            isSelected={cases.emailSent}
                            onValueChange={() => toggleCase("emailSent")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
