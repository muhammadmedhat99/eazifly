"use client";

import { Tab, Tabs } from "@heroui/react";
import {
  MoneyRecive,
  Moneys,
  MoneySend,
  Profile2User,
  Wallet,
} from "iconsax-reactjs";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const barData = [
  { name: "يناير", value: 5423 },
  { name: "فبراير", value: 4536 },
  { name: "مارس", value: 6564 },
  { name: "أبريل", value: 6898 },
  { name: "مايو", value: 6980 },
  { name: "يونيو", value: 4678 },
  { name: "يونيه", value: 3945 },
  { name: "أغسطس", value: 5484 },
  { name: "أكتوبر", value: 3433 },
  { name: "نوفمبر", value: 4544 },
  { name: "ديسمبر", value: 4000 },
];

const statCardsData = [
  {
    icon: Wallet,
    title: "الرصيد الحالي",
    value: "129,233 ج.م",
    change: "18.1%+ من الشهر السابق",
  },
  {
    icon: Moneys,
    title: "الرصيد الفعلي",
    value: "129,233 ج.م",
    change: "18.1%+ من الشهر السابق",
  },
  {
    icon: MoneySend,
    title: "إجمالي المصروفات",
    value: "129,233 ج.م",
    change: "18.1%+ من الشهر السابق",
    isNegative: true,
  },
  {
    icon: MoneyRecive,
    title: "إجمالي الإيرادات",
    value: "129,233 ج.م",
    change: "18.1%+ من الشهر السابق",
  },
];

const tabs = [
  { key: "summary", title: "ملخص سريع" },
  { key: "statistics", title: "الإحصائيات" },
  // { key: "daily-tasks", title: "المهام اليومية" },
];

const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  isPositive = true,
  isNegative = false,
}: {
  icon: any;
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  isNegative?: boolean;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow flex items-start justify-between">
    <div className="space-y-2">
      <p className="text-black-text text-sm font-semibold">{title}</p>
      <p className="text-2xl font-bold text-black">{value}</p>
      <p
        className={`text-sm flex items-center gap-1 font-medium ${
          isNegative ? "text-danger" : "text-success"
        }`}
      >
        {change}
        <span>{isPositive && !isNegative ? "↗" : "↘"}</span>
      </p>
    </div>
    <div className="mb-4">
      <Icon className="w-6 h-6 text-black-text" variant="Bold" />
    </div>
  </div>
);

const StatsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {statCardsData.map((card, index) => (
      <StatCard key={index} {...card} />
    ))}
  </div>
);

const ChartSection = () => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Profile2User className="w-5 h-5 text-black-text" />
        <h2 className="text-lg font-semibold text-black">إجمالي عدد الطلاب</h2>
      </div>
    </div>
    <div className="w-full h-[450px] border border-stroke rounded-xl">
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={barData}
          margin={{ top: 40, right: 30, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 14, fontWeight: "bold", dx: -10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 14, dx: -15, fontWeight: "bold" }}
            axisLine={false}
            tickLine={false}
          />
          <Bar
            dataKey="value"
            fill="#28a745"
            radius={[8, 8, 0, 0]}
            barSize={40}
          >
            <LabelList
              dataKey="value"
              position="top"
              className="font-semibold text-xs"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <h1 className="text-2xl font-bold text-black">الرئيسية</h1>
      <Tabs
        classNames={{
          base: "mt-10 w-full",
          tabList: `
      bg-primary/10 
      h-[40px] 
      flex 
      overflow-x-auto 
      sm:overflow-visible 
      sm:justify-start 
      rounded-lg
      scrollbar-hide
    `,
          tabContent: `
      text-sm 
      font-semibold 
      px-4 sm:px-7 
      whitespace-nowrap 
      group-data-[selected=true]:text-white
    `,
          cursor: "bg-primary text-white rounded-md",
        }}
        aria-label="Options"
      >
        {tabs.map(({ key, title }) => (
          <Tab key={key} title={title}>
            <StatsSection />
            <ChartSection />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default Dashboard;
