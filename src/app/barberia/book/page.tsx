import BookingForm from "@/components/barberia/BookingForm"

export default function BookPage() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold uppercase tracking-[0.2em] mb-2">Barberia</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-2">Book your appointment</h1>
        <p className="text-neutral-500 mb-10">Choose your service, pick a time, we&rsquo;ll handle the rest.</p>
        <BookingForm />
      </div>
    </main>
  )
}
