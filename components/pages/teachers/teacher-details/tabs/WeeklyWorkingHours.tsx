'use client'

import { useState } from 'react'
import { Edit2 } from "iconsax-reactjs";
import Link from "next/link";

const daysOfWeek: string[] = [
  'السبت',
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة'
]

interface TimeRange {
  from: string
  to: string
}

export default function WeeklyWorkingHours() {
  const [workingHours, setWorkingHours] = useState<TimeRange[][]>(
    daysOfWeek.map(() => [])
  )

  const handleTimeChange = (
    dayIndex: number,
    rangeIndex: number,
    key: 'from' | 'to',
    value: string
  ) => {
    const updated = [...workingHours]
    updated[dayIndex][rangeIndex][key] = value
    setWorkingHours(updated)
  }

  return (
    <div className="flex flex-col gap-2 col-span-2">
      <div className="">
        {daysOfWeek.map((day, dayIndex) => (
          <div key={day} className="flex items-center justify-between mb-4 border p-4 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between gap-2">
                <label className="text-[#272727] font-bold text-sm w-20">{day}</label>
            {workingHours[dayIndex].length === 0 ? (
              <div className="px-6 py-3 bg-gray-100 rounded-lg inline-flex justify-center items-center gap-0.5 text-sm font-bold">غير متاح</div>
            ) : (
              workingHours[dayIndex].map((range, rangeIndex) => (
                <div key={rangeIndex} className="flex gap-2">
                  <input
                    type="time"
                    value={range.to}
                    onChange={(e) =>
                      handleTimeChange(dayIndex, rangeIndex, 'to', e.target.value)
                    }
                    className="px-6 py-3 bg-gray-100 rounded-lg inline-flex justify-center items-center gap-0 text-sm font-semibold"
                  />
                  <input
                    type="time"
                    value={range.from}
                    onChange={(e) =>
                      handleTimeChange(dayIndex, rangeIndex, 'from', e.target.value)
                    }
                    className="px-6 py-3 bg-gray-100 rounded-lg inline-flex justify-center items-center gap-0 text-sm font-semibold"
                  />
                </div>
              ))
            )}
            </div>
            <Link href="#" className="flex items-center gap-1">
            <Edit2 size={18} />

            <span className="text-sm font-bold">تعديل</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
