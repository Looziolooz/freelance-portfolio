"use client"

import { useLang } from "@/components/LangProvider"
import CalendarView from "@/components/barberia/admin/CalendarView"

export default function AdminCalendarPage() {
  const { t } = useLang()

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">{t("barberia.admin.nav.calendar")}</h1>
      <CalendarView />
    </div>
  )
}
