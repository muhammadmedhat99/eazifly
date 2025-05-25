'use client'

import { useState } from 'react'
import { Copy, Add } from 'iconsax-reactjs'

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

  const handleAddTime = (dayIndex: number) => {
    const updated = [...workingHours]
    updated[dayIndex].push({ from: '00:00', to: '00:00' })
    setWorkingHours(updated)
  }

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
      <label className="text-[#272727] font-bold text-sm">ساعات العمل الأسبوعية</label>
      <div className="border p-4 rounded-lg bg-gray-50">
        {daysOfWeek.map((day, dayIndex) => (
          <div key={day} className="flex items-center gap-2 mb-4">
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
            <button
              type="button"
              onClick={() => handleAddTime(dayIndex)}
            >
                <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.9998 26.8346C22.5832 26.8346 26.3332 23.0846 26.3332 18.5013C26.3332 13.918 22.5832 10.168 17.9998 10.168C13.4165 10.168 9.6665 13.918 9.6665 18.5013C9.6665 23.0846 13.4165 26.8346 17.9998 26.8346Z" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.6665 18.5H21.3332" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 21.8346V15.168" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <button
              type="button"
            >
              <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1665 11.6654V14.1654C14.1665 17.4987 12.8332 18.832 9.49984 18.832H6.33317C2.99984 18.832 1.6665 17.4987 1.6665 14.1654V10.9987C1.6665 7.66536 2.99984 6.33203 6.33317 6.33203H8.83317" stroke="#272727" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.1668 11.6654H11.5002C9.50016 11.6654 8.8335 10.9987 8.8335 8.9987V6.33203L14.1668 11.6654Z" stroke="#272727" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.6665 2.16797H12.9998" stroke="#272727" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.8335 4.66797C5.8335 3.28464 6.95016 2.16797 8.3335 2.16797H10.5168" stroke="#272727" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.3334 7.16797V12.3263C18.3334 13.618 17.2834 14.668 15.9917 14.668" stroke="#272727" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.3335 7.16797H15.8335C13.9585 7.16797 13.3335 6.54297 13.3335 4.66797V2.16797L18.3335 7.16797Z" stroke="#272727" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
