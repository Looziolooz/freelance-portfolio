"use client"

import { useLang } from "@/components/LangProvider"
import ProductsManager from "@/components/barberia/admin/ProductsManager"

export default function AdminProductsPage() {
  const { t } = useLang()

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">{t("barberia.admin.nav.products")}</h1>
      <ProductsManager />
    </div>
  )
}
