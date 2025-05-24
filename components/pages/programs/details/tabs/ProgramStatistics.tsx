import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "ديسمبر",
    uv: 4000,
    pv: 2400,
  },
  {
    name: "نوفمبر",
    uv: 3000,
    pv: 1398,
  },
  {
    name: "اكتوبر",
    uv: 2000,
    pv: 9800,
  },
  {
    name: "سبتمبر",
    uv: 2780,
    pv: 3908,
  },
  {
    name: "اغسطس",
    uv: 5000,
    pv: 4800,
  },
  {
    name: "ماي",
    uv: 2390,
    pv: 3800,
  },
  {
    name: "ابريل",
    uv: 3490,
    pv: 4300,
  },
];

const barData = [
  { name: "يناير", value: 20 },
  { name: "فبراير", value: 15 },
  { name: "مارس", value: 13 },
  { name: "أبريل", value: 9 },
  { name: "مايو", value: 12 },
  { name: "يونيو", value: 18 },
  { name: "يونيه", value: 18 },
  { name: "أغسطس", value: 18 },
  { name: "أكتوبر", value: 18 },
  { name: "نوفمبر", value: 18 },
  { name: "ديسمبر", value: 5 },
];

export const ProgramStatistics = () => {
  return (
    <div className="bg-main p-5 flex flex-col gap-5">
      <div className="w-full h-[450px] border border-stroke rounded-xl">
        <AreaChart
          width={1280}
          height={430}
          data={data}
          margin={{
            top: 40,
            right: 0,
            left: 20, // Increased to make space for Y-axis outside
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="name"
            strokeOpacity={0.3}
            tick={{ dx: -10, dy: 10 }}
            className="font-semibold text-xs"
          />
          <YAxis
            strokeOpacity={0}
            tick={{ dx: -50 }} // Push ticks outward (left)
            axisLine={false}
            tickLine={false}
            className="text-xs font-semibold"
          />
          <Area
            type="monotone"
            dataKey="uv"
            stackId="1"
            strokeDasharray={"10 10"}
            stroke="#00000030"
            fill="#fff"
          />
          <Area
            type="monotone"
            dataKey="pv"
            stackId="1"
            stroke="#000"
            fill="#00000020"
          />
        </AreaChart>
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
};
