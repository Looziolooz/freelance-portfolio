"use client"

import { useLang } from "@/components/LangProvider"
import BookingsTable from "@/components/barberia/admin/BookingsTable"

export default function AdminDashboardPage() {
  const { t } = useLang()

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">{t("barberia.admin.title")}</h1>
      <p className="text-neutral-500 mb-6">{t("barberia.admin.nav.bookings")}</p>
      <BookingsTable />
    </div>
  )
}
