"use client"

import { useLang } from "@/components/LangProvider"
import LoginForm from "@/components/barberia/admin/LoginForm"

export default function AdminLoginPage() {
  const { t } = useLang()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold uppercase tracking-[0.2em] mb-2">Barberia</p>
          <h1 className="font-serif text-3xl">{t("barberia.admin.login")}</h1>
        </div>
        <LoginForm onLogin={() => window.location.href = "/barberia/admin"} />
      </div>
    </div>
  )
}
