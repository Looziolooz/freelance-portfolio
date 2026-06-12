"use client"

import { useState, useEffect } from "react"
import { useLang } from "@/components/LangProvider"

interface Product {
  id: string
  name: string
  category: string
  stock: number
  threshold: number
  price: number
}

export default function InventoryManager() {
  const { t } = useLang()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [edits, setEdits] = useState<Record<string, number>>({})

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    const res = await fetch("/api/barberia/admin/products")
    if (res.ok) {
      const data = await res.json()
      setProducts(data.products || [])
    }
    setLoading(false)
  }

  async function saveStock(id: string) {
    const stock = edits[id]
    if (stock === undefined) return
    await fetch(`/api/barberia/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    })
    const newEdits = { ...edits }
    delete newEdits[id]
    setEdits(newEdits)
    fetchProducts()
  }

  function getStatus(product: Product) {
    if (product.stock <= 0) return { label: t("barberia.admin.inventory.out"), class: "text-red-600 bg-red-50 dark:bg-red-950" }
    if (product.stock <= product.threshold) return { label: t("barberia.admin.inventory.low"), class: "text-amber-600 bg-amber-50 dark:bg-amber-950" }
    return { label: t("barberia.admin.inventory.in"), class: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950" }
  }

  if (loading) return <p className="text-neutral-500">Loading...</p>

  if (products.length === 0) return <p className="text-neutral-500">No products in inventory.</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-black dark:border-neutral-700">
            <th className="text-left p-2 text-sm font-semibold uppercase">{t("barberia.admin.products.name")}</th>
            <th className="text-left p-2 text-sm font-semibold uppercase">{t("barberia.admin.products.category")}</th>
            <th className="text-left p-2 text-sm font-semibold uppercase">{t("barberia.admin.products.stock")}</th>
            <th className="text-left p-2 text-sm font-semibold uppercase">Threshold</th>
            <th className="text-left p-2 text-sm font-semibold uppercase">Status</th>
            <th className="text-left p-2 text-sm font-semibold uppercase">{t("barberia.admin.inventory.save")}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const status = getStatus(p)
            return (
              <tr key={p.id} className="border-b border-neutral-200 dark:border-neutral-800">
                <td className="p-2 text-sm font-medium">{p.name}</td>
                <td className="p-2 text-sm">{p.category}</td>
                <td className="p-2 text-sm">
                  <input
                    type="number"
                    min={0}
                    value={edits[p.id] ?? p.stock}
                    onChange={(e) => setEdits({ ...edits, [p.id]: parseInt(e.target.value) || 0 })}
                    className="w-20 p-1 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none text-sm"
                  />
                </td>
                <td className="p-2 text-sm">{p.threshold}</td>
                <td className="p-2 text-sm">
                  <span className={`px-2 py-1 text-xs font-semibold ${status.class}`}>{status.label}</span>
                </td>
                <td className="p-2 text-sm">
                  {edits[p.id] !== undefined && edits[p.id] !== p.stock && (
                    <button
                      onClick={() => saveStock(p.id)}
                      className="px-3 py-1 text-xs font-semibold border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-none"
                    >
                      {t("barberia.admin.inventory.save")}
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
