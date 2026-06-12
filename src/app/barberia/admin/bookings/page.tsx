"use client"

import { useLang } from "@/components/LangProvider"
import BookingsTable from "@/components/barberia/admin/BookingsTable"

export default function AdminBookingsPage() {
  const { t } = useLang()

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">{t("barberia.admin.nav.bookings")}</h1>
      <BookingsTable />
    </div>
  )
}
