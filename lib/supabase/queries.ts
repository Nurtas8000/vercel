import { createClient } from "./client"
import type { Database } from "./types"

type Car = Database["public"]["Tables"]["cars"]["Row"]
type CarInsert = Database["public"]["Tables"]["cars"]["Insert"]
type Booking = Database["public"]["Tables"]["bookings"]["Row"]
type Payment = Database["public"]["Tables"]["payments"]["Row"]

// Получение всех доступных автомобилей
export async function getAvailableCars() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching cars:", error)
    return []
  }

  const ownerIds = [...new Set(data!.map((c) => c.owner_id).filter(Boolean))]
  const owners: Record<string, { full_name: string; avatar_url?: string }> = {}

  if (ownerIds.length) {
    const { data: ownerRows } = await supabase.from("users").select("id, full_name, avatar_url").in("id", ownerIds)

    ownerRows?.forEach((u) => {
      owners[u.id as string] = { full_name: u.full_name, avatar_url: u.avatar_url ?? undefined }
    })
  }

  return data!.map((c) => ({
    ...c,
    users: owners[c.owner_id as string] ?? null,
  })) as any
}

// Получение автомобиля по ID
export async function getCarById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("cars").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching car:", error)
    return null
  }

  const { data: owner } = await supabase
    .from("users")
    .select("id, full_name, phone, avatar_url")
    .eq("id", data!.owner_id)
    .single()

  return { ...data, users: owner ?? null } as any
}

// Создание нового автомобиля
export async function createCar(car: CarInsert) {
  const supabase = createClient()

  const { data, error } = await supabase.from("cars").insert(car).select().single()

  if (error) {
    console.error("Error creating car:", error)
    throw error
  }

  return data
}

// Получение бронирований пользователя
export async function getUserBookings(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      cars (
        brand,
        model,
        year,
        photos
      ),
      payments (
        amount,
        due_date,
        status
      )
    `)
    .eq("renter_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data
}

// Создание бронирования
export async function createBooking(booking: Database["public"]["Tables"]["bookings"]["Insert"]) {
  const supabase = createClient()

  const { data, error } = await supabase.from("bookings").insert(booking).select().single()

  if (error) {
    console.error("Error creating booking:", error)
    throw error
  }

  return data
}

// Получение платежей по бронированию
export async function getBookingPayments(bookingId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("booking_id", bookingId)
    .order("due_date", { ascending: true })

  if (error) {
    console.error("Error fetching payments:", error)
    return []
  }

  return data
}

// Обновление статуса платежа
export async function updatePaymentStatus(paymentId: string, status: "paid" | "failed", transactionId?: string) {
  const supabase = createClient()

  const updateData: any = {
    status,
    paid_date: status === "paid" ? new Date().toISOString() : null,
  }

  if (transactionId) {
    updateData.kaspi_transaction_id = transactionId
  }

  const { data, error } = await supabase.from("payments").update(updateData).eq("id", paymentId).select().single()

  if (error) {
    console.error("Error updating payment:", error)
    throw error
  }

  return data
}

// Поиск автомобилей с фильтрами
export async function searchCars(filters: {
  location?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  paymentFrequency?: string
}) {
  const supabase = createClient()

  let query = supabase
    .from("cars")
    .select(`
      *,
      users:owner_id (
        full_name,
        avatar_url
      )
    `)
    .eq("available", true)

  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`)
  }

  if (filters.minPrice) {
    query = query.gte("rental_price", filters.minPrice)
  }

  if (filters.maxPrice) {
    query = query.lte("rental_price", filters.maxPrice)
  }

  if (filters.brand) {
    query = query.ilike("brand", `%${filters.brand}%`)
  }

  if (filters.paymentFrequency) {
    query = query.eq("payment_frequency", filters.paymentFrequency)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching cars:", error)
    return []
  }

  return data
}
