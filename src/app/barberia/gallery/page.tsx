export default function GalleryPage() {
  const palette = ["from-emerald-900 to-neutral-950", "from-amber-900 to-neutral-950", "from-neutral-800 to-neutral-950"]

  return (
    <main className="min-h-screen bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-emerald-400 text-sm font-semibold uppercase tracking-[0.2em] mb-2">Barberia</p>
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">Gallery</h1>
        <p className="text-neutral-500 mb-12">A look inside the shop.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {["The Shop", "Barber Chair", "Precision Cut", "Beard Work", "Product Line", "The Team"].map((label, i) => (
            <div key={i} className={`aspect-[4/3] bg-gradient-to-br ${palette[i % palette.length]} border border-neutral-700 flex items-center justify-center text-neutral-400 text-sm font-medium`}>
              {label}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
