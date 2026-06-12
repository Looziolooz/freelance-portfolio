"use client"

import { useState } from "react"
import { SERVICES, BARBERS } from "@/lib/barberia/config"
import { useLang } from "@/components/LangProvider"

export default function BookingForm() {
  const { lang, t } = useLang()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [slots, setSlots] = useState<string[]>([])
  const [slotsError, setSlotsError] = useState("")
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    service: "",
    barber: "any",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  async function loadSlots(service: string, barber: string, date: string) {
    setLoading(true)
    setSlotsError("")
    const params = new URLSearchParams({ service, barber, date })
    const res = await fetch(`/api/barberia/availability?${params}`)
    if (!res.ok) {
      setSlotsError(t("barberia.form.slots.error"))
      setLoading(false)
      return
    }
    const data = await res.json()
    setSlots(data.slots || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/barberia/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      alert(t("barberia.form.error"))
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <div className="text-6xl mb-6">&#10003;</div>
        <h2 className="text-2xl font-bold mb-2">{t("barberia.form.success")}</h2>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold uppercase tracking-wider">{t("barberia.form.service")}</label>
        <select
          value={form.service}
          onChange={(e) => { update("service", e.target.value); setStep(2) }}
          className="w-full p-3 border-2 border-black bg-white dark:bg-neutral-900 dark:border-neutral-700 rounded-none"
          required
        >
          <option value="">—</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.id}>{s.name[lang as "it" | "en" | "sv"]} (€{s.price} · {s.duration}min)</option>
          ))}
        </select>
      </div>

      {step >= 2 && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold uppercase tracking-wider">{t("barberia.form.barber")}</label>
          <select
            value={form.barber}
            onChange={(e) => update("barber", e.target.value)}
            className="w-full p-3 border-2 border-black bg-white dark:bg-neutral-900 dark:border-neutral-700 rounded-none"
          >
            <option value="any">—</option>
            {BARBERS.map((b) => (
              <option key={b.id} value={b.slug}>{b.name[lang as "it" | "en" | "sv"]}</option>
            ))}
          </select>
        </div>
      )}

      {step >= 2 && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold uppercase tracking-wider">{t("barberia.form.date")}</label>
          <input
            type="date"
            value={form.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              update("date", e.target.value)
              if (form.service) loadSlots(form.service, form.barber, e.target.value)
              setStep(3)
            }}
            className="w-full p-3 border-2 border-black bg-white dark:bg-neutral-900 dark:border-neutral-700 rounded-none"
            required
          />
        </div>
      )}

      {step >= 3 && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold uppercase tracking-wider">{t("barberia.form.time")}</label>
          {loading ? (
            <p className="text-sm text-neutral-500">Loading...</p>
          ) : slotsError ? (
            <p className="text-sm text-red-500">{slotsError}</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-neutral-500">No available slots</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => update("time", slot)}
                  className={`p-2 text-sm border-2 rounded-none transition-colors ${
                    form.time === slot
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200"
                      : "border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step >= 3 && form.time && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold uppercase tracking-wider">{t("barberia.form.name")}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full p-3 border-2 border-black bg-white dark:bg-neutral-900 dark:border-neutral-700 rounded-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold uppercase tracking-wider">{t("barberia.form.email")}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full p-3 border-2 border-black bg-white dark:bg-neutral-900 dark:border-neutral-700 rounded-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold uppercase tracking-wider">{t("barberia.form.phone")}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full p-3 border-2 border-black bg-white dark:bg-neutral-900 dark:border-neutral-700 rounded-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold uppercase tracking-wider">{t("barberia.form.notes")}</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className="w-full p-3 border-2 border-black bg-white dark:bg-neutral-900 dark:border-neutral-700 rounded-none"
                rows={1}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg transition-colors disabled:opacity-50 border-2 border-black rounded-none"
          >
            {loading ? "..." : t("barberia.form.submit")}
          </button>
        </>
      )}
    </form>
  )
}
