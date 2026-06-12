"use client"

import { useState, useEffect } from "react"
import { useLang } from "@/components/LangProvider"

interface Booking {
  id: string
  service: string
  barber: string
  date: string
  time: string
  name: string
  status: string
}

export default function CalendarView() {
  const { t } = useLang()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const res = await fetch("/api/barberia/admin/bookings")
      if (res.ok) {
        const data = await res.json()
        setBookings(data.bookings || [])
      }
      setLoading(false)
    }
    fetchAll()
  }, [])

  function getBookingsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return bookings.filter((b) => b.date === dateStr)
  }

  function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)) }
  function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)) }
  function today() { setCurrentDate(new Date()) }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="px-3 py-1 border-2 border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-none">&larr;</button>
        <h2 className="text-xl font-bold">{monthNames[month]} {year}</h2>
        <div className="flex gap-2">
          <button onClick={today} className="px-3 py-1 border-2 border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm rounded-none">{t("barberia.admin.calendar.today")}</button>
          <button onClick={nextMonth} className="px-3 py-1 border-2 border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-none">&rarr;</button>
        </div>
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-7 border-2 border-black dark:border-neutral-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="p-2 text-sm font-semibold uppercase bg-neutral-100 dark:bg-neutral-900 border-b border-r border-black dark:border-neutral-700 last:border-r-0">{d}</div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="p-2 border-b border-r border-black dark:border-neutral-700 min-h-[80px]" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dayBookings = getBookingsForDay(day)
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear()
            return (
              <div
                key={day}
                className={`p-2 border-b border-r border-black dark:border-neutral-700 min-h-[80px] text-sm ${
                  isToday ? "bg-emerald-50 dark:bg-emerald-950" : ""
                }`}
              >
                <span className={`font-semibold ${isToday ? "text-emerald-600" : ""}`}>{day}</span>
                <div className="mt-1 space-y-1">
                  {dayBookings.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      className={`text-xs px-1 py-0.5 truncate ${
                        b.status === "confirmed"
                          ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                          : b.status === "cancelled"
                          ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          : "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                      }`}
                    >
                      {b.time} {b.name}
                    </div>
                  ))}
                  {dayBookings.length > 3 && <p className="text-xs text-neutral-500">+{dayBookings.length - 3} more</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
