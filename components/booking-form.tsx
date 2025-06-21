"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, CreditCard, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingFormProps {
  car: any
}

export function BookingForm({ car }: BookingFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    renterName: "",
    renterPhone: "",
    renterEmail: "",
    startDate: "",
    notes: "",
  })

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Создаем пользователя (упрощенно для демо)
      const { data: user, error: userError } = await supabase
        .from("users")
        .insert({
          email: formData.renterEmail,
          phone: formData.renterPhone,
          full_name: formData.renterName,
          role: "renter",
        })
        .select()
        .single()

      if (userError && userError.code !== "23505") {
        // Если пользователь уже существует, получаем его
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", formData.renterEmail)
          .single()

        if (!existingUser) throw userError
      }

      const userId =
        user?.id || (await supabase.from("users").select("id").eq("email", formData.renterEmail).single()).data?.id

      // Рассчитываем даты
      const startDate = new Date(formData.startDate)
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + car.rental_period_months)

      const totalAmount = car.rental_price * car.rental_period_months

      // Создаем бронирование
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          car_id: car.id,
          renter_id: userId,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          total_amount: totalAmount,
          status: "pending",
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      // Создаем график платежей
      const payments = []
      const paymentAmount = car.rental_price
      const currentDate = new Date(startDate)

      for (let i = 0; i < car.rental_period_months; i++) {
        payments.push({
          booking_id: booking.id,
          amount: paymentAmount,
          due_date: currentDate.toISOString().split("T")[0],
          status: "pending",
          payment_method: "kaspi_pay",
        })

        currentDate.setMonth(currentDate.getMonth() + 1)
      }

      const { error: paymentsError } = await supabase.from("payments").insert(payments)

      if (paymentsError) throw paymentsError

      // Обновляем статус автомобиля
      await supabase.from("cars").update({ available: false }).eq("id", car.id)

      alert("Бронирование успешно создано! Мы свяжемся с вами для подтверждения.")
      router.push("/catalog")
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Ошибка при создании бронирования. Попробуйте еще раз.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Забронировать автомобиль</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="renterName">Ваше имя</Label>
              <Input
                id="renterName"
                value={formData.renterName}
                onChange={(e) => setFormData({ ...formData, renterName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="renterPhone">Телефон</Label>
              <Input
                id="renterPhone"
                type="tel"
                value={formData.renterPhone}
                onChange={(e) => setFormData({ ...formData, renterPhone: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="renterEmail">Email</Label>
            <Input
              id="renterEmail"
              type="email"
              value={formData.renterEmail}
              onChange={(e) => setFormData({ ...formData, renterEmail: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="startDate">Дата начала аренды</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Дополнительные пожелания</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Укажите любые дополнительные пожелания..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Создание бронирования...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Забронировать за {car.rental_price?.toLocaleString()}₸/мес
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            После бронирования мы свяжемся с вами для подтверждения и подписания договора
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
