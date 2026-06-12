"use client"

import { useState, useEffect } from "react"
import { useLang } from "@/components/LangProvider"

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description: string
  stock: number
  threshold: number
  active: boolean
}

export default function ProductsManager() {
  const { t } = useLang()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: "", category: "", price: "", image: "", description: "", stock: "0", threshold: "5" })

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

  function resetForm() {
    setForm({ name: "", category: "", price: "", image: "", description: "", stock: "0", threshold: "5" })
  }

  async function addProduct() {
    await fetch("/api/barberia/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, active: true }),
    })
    resetForm()
    setShowAdd(false)
    fetchProducts()
  }

  async function updateProduct(id: string) {
    await fetch(`/api/barberia/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setEditingId(null)
    fetchProducts()
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return
    await fetch(`/api/barberia/admin/products/${id}`, { method: "DELETE" })
    fetchProducts()
  }

  function startEdit(p: Product) {
    setEditingId(p.id)
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      image: p.image || "",
      description: p.description || "",
      stock: String(p.stock),
      threshold: String(p.threshold),
    })
  }

  return (
    <div>
      <button
        onClick={() => { resetForm(); setShowAdd(!showAdd) }}
        className="mb-6 px-4 py-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold transition-colors rounded-none"
      >
        {showAdd ? "—" : "+"} {t("barberia.admin.products.add")}
      </button>

      {showAdd && (
        <div className="mb-6 p-4 border-2 border-black dark:border-neutral-700 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder={t("barberia.admin.products.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none" />
            <input placeholder={t("barberia.admin.products.category")} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none" />
            <input placeholder={t("barberia.admin.products.price")} type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none" />
            <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none" />
            <input placeholder={t("barberia.admin.products.stock")} type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none" />
            <input placeholder="Threshold" type="number" value={form.threshold} onChange={(e) => setForm({ ...form, threshold: e.target.value })} className="p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none" rows={2} />
          <button onClick={addProduct} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors border-2 border-black rounded-none">{t("barberia.admin.products.save")}</button>
        </div>
      )}

      {loading ? (
        <p className="text-neutral-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-neutral-500">No products.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black dark:border-neutral-700">
                <th className="text-left p-2 text-sm font-semibold uppercase">{t("barberia.admin.products.name")}</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">{t("barberia.admin.products.category")}</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">{t("barberia.admin.products.price")}</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">{t("barberia.admin.products.stock")}</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">{t("barberia.admin.products.active")}</th>
                <th className="text-left p-2 text-sm font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-neutral-200 dark:border-neutral-800">
                  {editingId === p.id ? (
                    <>
                      <td className="p-2"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-1 border border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none text-sm" /></td>
                      <td className="p-2"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-1 border border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none text-sm" /></td>
                      <td className="p-2"><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full p-1 border border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none text-sm" /></td>
                      <td className="p-2"><input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full p-1 border border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-none text-sm" /></td>
                      <td className="p-2 text-sm">{p.active ? "Yes" : "No"}</td>
                      <td className="p-2 space-x-1">
                        <button onClick={() => updateProduct(p.id)} className="px-2 py-1 text-xs font-semibold border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-none">{t("barberia.admin.products.save")}</button>
                        <button onClick={() => setEditingId(null)} className="px-2 py-1 text-xs font-semibold border-2 border-neutral-400 text-neutral-600 hover:bg-neutral-100 rounded-none">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2 text-sm">{p.name}</td>
                      <td className="p-2 text-sm">{p.category}</td>
                      <td className="p-2 text-sm">€{p.price}</td>
                      <td className="p-2 text-sm">{p.stock}</td>
                      <td className="p-2 text-sm">{p.active ? "Yes" : "No"}</td>
                      <td className="p-2 text-sm space-x-1">
                        <button onClick={() => startEdit(p)} className="px-2 py-1 text-xs font-semibold border-2 border-black dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-none">{t("barberia.admin.products.edit")}</button>
                        <button onClick={() => deleteProduct(p.id)} className="px-2 py-1 text-xs font-semibold border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-none">{t("barberia.admin.products.delete")}</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
