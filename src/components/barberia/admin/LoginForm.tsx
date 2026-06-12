"use client"

import { useState } from "react"
import { useLang } from "@/components/LangProvider"

interface LoginFormProps {
  onLogin: () => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const { t } = useLang()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/barberia/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError(t("barberia.form.error"))
        setLoading(false)
        return
      }
      onLogin()
    } catch {
      setError(t("barberia.form.error"))
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold text-center">{t("barberia.admin.login")}</h1>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("barberia.admin.login.pass")}
        className="w-full p-3 border-2 border-black bg-white dark:bg-neutral-900 dark:border-neutral-700 rounded-none"
        autoFocus
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors disabled:opacity-50 border-2 border-black rounded-none"
      >
        {loading ? "..." : t("barberia.admin.login.submit")}
      </button>
    </form>
  )
}
