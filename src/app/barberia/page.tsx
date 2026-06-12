import Link from "next/link"

export default function BarberiaPage() {
  return (
    <main className="min-h-screen">
      <section className="relative py-32 px-6 text-center bg-neutral-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-[0.2em] mb-4">Barberia</p>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight mb-6">Barbiere · Grooming · Wellness</h1>
          <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
            Traditional barbering with a modern edge. Walk-ins welcome, appointments preferred.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/barberia/book"
              className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg transition-colors border-2 border-emerald-600"
            >
              Book now
            </Link>
            <Link
              href="/barberia/gallery"
              className="inline-block px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg transition-colors"
            >
              Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-neutral-950 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-[0.2em] mb-2">Services</p>
          <h2 className="font-serif text-4xl mb-12">What we offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Haircut", price: "€25", desc: "Classic cut, modern styles" },
              { name: "Beard", price: "€15", desc: "Trim, shape & condition" },
              { name: "Haircut + Beard", price: "€35", desc: "Complete grooming" },
              { name: "Shave", price: "€22", desc: "Hot towel straight razor" },
              { name: "Kids", price: "€18", desc: "Under 12" },
            ].map((s) => (
              <div key={s.name} className="border border-neutral-800 p-6 text-left">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{s.name}</h3>
                  <span className="text-emerald-400 font-bold">{s.price}</span>
                </div>
                <p className="text-sm text-neutral-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-[0.2em] mb-2">Location</p>
          <h2 className="font-serif text-4xl mb-6">Find us</h2>
          <p className="text-neutral-400 mb-4">Via del Barbiere 42, Milano</p>
          <p className="text-neutral-500 text-sm">Mon–Sat · 9:00 – 19:00</p>
        </div>
      </section>
    </main>
  )
}
