export type Lang = "it" | "en" | "sv"

export interface Service {
  id: string
  slug: string
  price: number
  duration: number
  name: Record<Lang, string>
}

export interface Barber {
  id: string
  slug: string
  name: Record<Lang, string>
  role: Record<Lang, string>
}

export const SERVICES: Service[] = [
  { id: "1", slug: "haircut", price: 25, duration: 30, name: { it: "Taglio", en: "Haircut", sv: "Klippning" } },
  { id: "2", slug: "beard", price: 15, duration: 20, name: { it: "Barba", en: "Beard", sv: "Skägg" } },
  { id: "3", slug: "haircut-beard", price: 35, duration: 45, name: { it: "Taglio + Barba", en: "Haircut + Beard", sv: "Klippning + Skägg" } },
  { id: "4", slug: "shave", price: 22, duration: 30, name: { it: "Rasatura", en: "Shave", sv: "Rakning" } },
  { id: "5", slug: "kids", price: 18, duration: 20, name: { it: "Bambini", en: "Kids", sv: "Barn" } },
]

export const BARBERS: Barber[] = [
  { id: "1", slug: "marco", name: { it: "Marco", en: "Marco", sv: "Marco" }, role: { it: "Master barber", en: "Master barber", sv: "Master barber" } },
  { id: "2", slug: "luca", name: { it: "Luca", en: "Luca", sv: "Luca" }, role: { it: "Barber stylist", en: "Barber stylist", sv: "Barber stylist" } },
  { id: "3", slug: "dino", name: { it: "Dino", en: "Dino", sv: "Dino" }, role: { it: "Apprentice", en: "Apprentice", sv: "Lärling" } },
]

export const BARBERIA_HOURS = {
  mon: { open: "09:00", close: "19:00" },
  tue: { open: "09:00", close: "19:00" },
  wed: { open: "09:00", close: "19:00" },
  thu: { open: "09:00", close: "20:00" },
  fri: { open: "09:00", close: "20:00" },
  sat: { open: "09:00", close: "18:00" },
  sun: null,
}

export function getDayKey(date: Date): string {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][date.getDay()]
}

export function generateTimeSlots(hours: { open: string; close: string }, duration: number): string[] {
  const slots: string[] = []
  const [openH, openM] = hours.open.split(":").map(Number)
  const [closeH, closeM] = hours.close.split(":").map(Number)
  let start = openH * 60 + openM
  const end = closeH * 60 + closeM
  while (start + duration <= end) {
    const h = Math.floor(start / 60)
    const m = start % 60
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
    start += duration
  }
  return slots
}
