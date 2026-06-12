"use client"

import { useLang } from "@/components/LangProvider"
import InventoryManager from "@/components/barberia/admin/InventoryManager"

export default function AdminInventoryPage() {
  const { t } = useLang()

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">{t("barberia.admin.nav.inventory")}</h1>
      <InventoryManager />
    </div>
  )
}
