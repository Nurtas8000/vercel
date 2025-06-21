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
      const freq = car.payment_frequency
      const numPayments = car.number_of_payments || 0

      if (numPayments > 0) {
        switch (freq) {
          case "daily":
            endDate.setDate(startDate.getDate() + numPayments)
            break
          case "weekly":
            endDate.setDate(startDate.getDate() + numPayments * 7)
            break
          case "monthly":
            endDate.setMonth(startDate.getMonth() + numPayments)
            break
          case "six_times_week":
            // Рассчитываем количество полных недель и оставшихся дней
            const fullWeeks = Math.floor(numPayments / 6)
            const remainingDays = numPayments % 6
            let totalCalendarDays = fullWeeks * 7
            // Добавляем оставшиеся дни, пропуская воскресенья, если они попадаются
            const tempCurrentDate = new Date(startDate)
            tempCurrentDate.setDate(tempCurrentDate.getDate() + fullWeeks * 7) // Перемещаемся на конец полных недель

            let addedPaymentDays = 0
            while (addedPaymentDays < remainingDays) {
              if (tempCurrentDate.getDay() !== 0) {
                // Если не воскресенье
                addedPaymentDays++
              }
              if (addedPaymentDays < remainingDays) {
                // Если еще не все доп. дни учтены
                tempCurrentDate.setDate(tempCurrentDate.getDate() + 1)
                totalCalendarDays++
              } else if (addedPaymentDays === remainingDays && tempCurrentDate.getDay() === 0 && remainingDays > 0) {
                // Если последний платежный день попал на воскресенье, его нужно учесть, но сдвинуть дату на понедельник
                // Однако, если это последний платеж, он должен быть в этот день.
                // Этот расчет сложен для точного endDate.
                // Проще всего для endDate указать примерную дату.
                // Для six_times_week, endDate будет примерно startDate + (numPayments / 6 * 7) дней.
              }
            }
            endDate.setDate(startDate.getDate() + Math.ceil(numPayments / 6) * 7) // Примерная дата окончания
            break
          default:
            // Если частота не определена, можно оставить как есть или добавить логику по умолчанию
            break
        }
      }

      const bookingData = {
        car_id: car.id,
        renter_id: user.id,
        owner_id: car.owner_id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_price: (car.rental_price || 0) * (car.number_of_payments || 0),
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
