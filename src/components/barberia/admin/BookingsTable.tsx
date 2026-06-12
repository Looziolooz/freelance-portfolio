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
  email: string
  phone: string
  notes: string
  status: string
  createdAt: string
}

export default function BookingsTable() {
  const { t } = useLang()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  async function fetchBookings() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter !== "all") params.set("status", filter)
    const res = await fetch(`/api/barberia/admin/bookings?${params}`)
    if (res.ok) {
      const data = await res.json()
      setBookings(data.bookings || [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchBookings() }, [filter])

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/barberia/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    fetchBookings()
  }

  async function deleteBooking(id: string) {
    if (!confirm("Delete this booking?")) return
    await fetch(`/api/barberia/admin/bookings/${id}`, { method: "DELETE" })
    fetchBookings()
  }

  const filters = [
    { value: "all", label: "All" },
    { value: "pending", label: t("barberia.admin.bookings.pending") },
    { value: "confirmed", label: t("barberia.admin.bookings.confirmed") },
    { value: "cancelled", label: t("barberia.admin.bookings.cancelled") },
  ]

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 border-2 text-sm font-semibold transition-colors rounded-none ${
              filter === f.value
                ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200"
                : "border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-neutral-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black dark:border-neutral-700">
                <th className="text-left p-2 text-sm font-semibold uppercase">Date</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">Time</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">Name</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">Service</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">Barber</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">Status</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-2 text-sm">{b.date}</td>
                  <td className="p-2 text-sm">{b.time}</td>
                  <td className="p-2 text-sm">{b.name}</td>
                  <td className="p-2 text-sm">{b.service}</td>
                  <td className="p-2 text-sm">{b.barber}</td>
                  <td className="p-2 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold uppercase ${
                      b.status === "confirmed" ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950" :
                      b.status === "cancelled" ? "text-red-600 bg-red-50 dark:bg-red-950" :
                      "text-amber-600 bg-amber-50 dark:bg-amber-950"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-2 text-sm space-x-1">
                    {b.status === "pending" && (
                      <button onClick={() => updateStatus(b.id, "confirmed")} className="px-2 py-1 text-xs font-semibold border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-none">
                        {t("barberia.admin.bookings.confirm")}
                      </button>
                    )}
                    {b.status !== "cancelled" && (
                      <button onClick={() => updateStatus(b.id, "cancelled")} className="px-2 py-1 text-xs font-semibold border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-none">
                        {t("barberia.admin.bookings.cancel")}
                      </button>
                    )}
                    <button onClick={() => deleteBooking(b.id)} className="px-2 py-1 text-xs font-semibold border-2 border-neutral-400 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-none">
                      {t("barberia.admin.bookings.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
