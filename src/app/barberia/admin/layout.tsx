"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLang } from "@/components/LangProvider"
import LoginForm from "@/components/barberia/admin/LoginForm"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  const pathname = usePathname()
  const router = useRouter()
  const [authed, setAuthed] = useState<boolean | null>(null)
  const isLoginPage = pathname === "/barberia/admin/login"

  useEffect(() => {
    fetch("/api/barberia/admin/bookings")
      .then((res) => setAuthed(res.ok))
      .catch(() => setAuthed(false))
  }, [])

  async function handleLogout() {
    await fetch("/api/barberia/admin/logout", { method: "POST" })
    setAuthed(false)
    router.push("/barberia/admin/login")
  }

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <p className="text-neutral-500">Loading...</p>
      </div>
    )
  }

  if (!authed && !isLoginPage) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <LoginForm onLogin={() => { setAuthed(true); router.push("/barberia/admin") }} />
      </div>
    )
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">{children}</div>
  }

  const navItems = [
    { href: "/barberia/admin", label: t("barberia.admin.nav.bookings") },
    { href: "/barberia/admin/calendar", label: t("barberia.admin.nav.calendar") },
    { href: "/barberia/admin/products", label: t("barberia.admin.nav.products") },
    { href: "/barberia/admin/inventory", label: t("barberia.admin.nav.inventory") },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex">
      <aside className="w-56 shrink-0 border-r-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 flex flex-col">
        <div className="mb-8">
          <Link href="/barberia" className="font-serif text-xl font-bold">Barberia</Link>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">{t("barberia.admin.title")}</p>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm font-medium transition-colors border-l-2 ${
                pathname === item.href
                  ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200"
                  : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-left"
        >
          {t("barberia.admin.logout")}
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
