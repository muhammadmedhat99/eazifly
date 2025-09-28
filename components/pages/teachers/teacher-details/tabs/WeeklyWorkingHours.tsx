'use client'

import { useEffect, useState } from 'react'
import { Edit2 } from 'iconsax-reactjs'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import { useParams } from 'next/navigation'
import { fetchClient } from '@/lib/utils'

const daysOfWeek: string[] = [
  'السبت',
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة'
]

const englishToArabicDays: Record<string, string> = {
  Saturday: 'السبت',
  Sunday: 'الأحد',
  Monday: 'الاثنين',
  Tuesday: 'الثلاثاء',
  Wednesday: 'الأربعاء',
  Thursday: 'الخميس',
  Friday: 'الجمعة'
}

interface TimeRange {
  from: string
  to: string
}

export default function WeeklyWorkingHours() {
  const params = useParams();
  const user_id = params.id;

  const [workingHours, setWorkingHours] = useState<TimeRange[][]>(
    daysOfWeek.map(() => [])
  )

  const { data: availabilityTimes, isLoading: isLoadingAvailabilityTimes } = useQuery({
    queryKey: ['GetAvailabilityTimes', user_id],
    queryFn: async () =>
      await fetchClient(`client/availability/time/${user_id}`, {
        headers: {
          Authorization: `Bearer ${getCookie('token')}`,
          Accept: 'application/json',
          local: 'ar'
        }
      }),
    enabled: !!user_id
  })

  useEffect(() => {
    if (availabilityTimes?.data) {
      const updated: TimeRange[][] = daysOfWeek.map(() => [])

      Object.entries(availabilityTimes.data).forEach(([engDay, times]) => {
        const arabicDay = englishToArabicDays[engDay]
        const dayIndex = daysOfWeek.indexOf(arabicDay)
        if (dayIndex > -1 && Array.isArray(times)) {
          updated[dayIndex] = (times as any[]).map((t) => ({
            from: t.start_time?.slice(0, 5) || '',
            to: t.end_time?.slice(0, 5) || ''
          }))
        }
      })

      setWorkingHours(updated)
    }
  }, [availabilityTimes])

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
          <div
            key={day}
            className="flex items-center justify-between mb-4 border p-4 rounded-lg bg-gray-50 overflow-x-auto gap-8"
          >
            <div className="flex flex-col sm:flex-row items-start md:items-center gap-2 mb-2">
              <label className="text-[#272727] font-bold text-sm w-20">
                {day}
              </label>

              <div className="flex flex-wrap gap-2 flex-1">
                {workingHours[dayIndex].length === 0 ? (
                  <div className="px-6 py-3 bg-gray-100 rounded-lg inline-flex justify-center items-center gap-0.5 text-sm font-bold">
                    غير متاح
                  </div>
                ) : (
                  workingHours[dayIndex].map((range, rangeIndex) => (
                    <div key={rangeIndex} className="flex gap-2 w-full sm:w-[calc(50%-0.5rem)]">
                      <input
                        type="time"
                        value={range.from}
                        onChange={(e) =>
                          handleTimeChange(dayIndex, rangeIndex, 'from', e.target.value)
                        }
                        className="w-1/2 px-2 md:px-4 py-3 bg-gray-100 rounded-lg text-sm font-semibold"
                      />
                      <input
                        type="time"
                        value={range.to}
                        onChange={(e) =>
                          handleTimeChange(dayIndex, rangeIndex, 'to', e.target.value)
                        }
                        className="w-1/2 px-2 md:px-4 py-3 bg-gray-100 rounded-lg text-sm font-semibold"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <button disabled className="hidden md:flex items-center gap-1 opacity-50 ">
              <Edit2 size={18} />
              <span className="text-sm font-bold">تعديل</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
