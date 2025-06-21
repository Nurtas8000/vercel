"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { createBooking } from "@/lib/supabase/queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import type { Database } from "@/lib/supabase/types"

type Car = Database["public"]["Tables"]["cars"]["Row"]

interface BookingFormProps {
  car: Car
}

export function BookingForm({ car }: BookingFormProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleBooking = async () => {
    if (!user) {
      // Если пользователь не авторизован, перенаправляем на страницу входа
      router.push("/login")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const startDate = new Date()
      const endDate = new Date(startDate)
      endDate.setMonth(startDate.getMonth() + (car.rental_period_months || 0))

      const bookingData = {
        car_id: car.id,
        renter_id: user.id,
        owner_id: car.owner_id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_price: (car.rental_price || 0) * (car.rental_period_months || 0),
        status: "pending" as const, // 'pending', 'confirmed', 'active', 'completed', 'cancelled'
      }

      await createBooking(bookingData)

      setSuccess(true)
      // Перенаправляем пользователя в личный кабинет после успешного бронирования
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      console.error("Booking failed:", err)
      setError("Не удалось создать бронирование. Пожалуйста, попробуйте еще раз.")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
  }

  if (success) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">Заявка успешно отправлена!</p>
            <p className="text-sm text-green-700">Перенаправляем вас в личный кабинет...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleBooking}
        disabled={isLoading}
        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : user ? (
          "Арендовать с выкупом"
        ) : (
          "Войти, чтобы арендовать"
        )}
      </Button>
      {error && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  )
}
