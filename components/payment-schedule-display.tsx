"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarDays, Hash, CircleDollarSign } from "lucide-react"

interface PaymentScheduleItem {
  paymentNumber: number
  dueDate: string
  amount: number
  status?: "paid" | "pending" | "overdue" // Optional for future use
}

interface PaymentScheduleDisplayProps {
  rentalPrice: number
  paymentFrequency: "daily" | "weekly" | "monthly" | "six_times_week"
  numberOfPayments: number
  startDate?: Date // Optional: if not provided, assumes today for display purposes
  maxRowsToShow?: number // Optional: to limit initial display
}

export function PaymentScheduleDisplay({
  rentalPrice,
  paymentFrequency,
  numberOfPayments,
  startDate = new Date(), // Default to today if no start date provided
  maxRowsToShow,
}: PaymentScheduleDisplayProps) {
  const schedule: PaymentScheduleItem[] = []

  const currentDate = new Date(startDate)

  for (let i = 1; i <= numberOfPayments; i++) {
    const paymentDate = new Date(currentDate)
    schedule.push({
      paymentNumber: i,
      dueDate: paymentDate.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      amount: rentalPrice,
    })

    // Increment date for next payment
    switch (paymentFrequency) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + 1)
        break
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7)
        break
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + 1)
        break
      case "six_times_week":
        // This is a bit simplified: assumes payments are Mon-Sat.
        // A more complex logic would skip Sundays or specific holidays.
        // For now, just advance by one day, assuming 6 payments occur sequentially.
        currentDate.setDate(currentDate.getDate() + 1)
        // If it's a Sunday (day 0), skip to Monday (day 1)
        if (currentDate.getDay() === 0) {
          currentDate.setDate(currentDate.getDate() + 1)
        }
        break
    }
  }

  const displayedSchedule = maxRowsToShow ? schedule.slice(0, maxRowsToShow) : schedule

  if (numberOfPayments === 0 || rentalPrice === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2" />
            График платежей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Условия для генерации графика не заданы.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="w-5 h-5 mr-2" />
          Примерный график платежей
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Первый платеж начинается с {startDate.toLocaleDateString("ru-RU")}. Всего {numberOfPayments} платежей по{" "}
          {rentalPrice.toLocaleString()} ₸.
        </p>
        <ScrollArea className={`h-[${maxRowsToShow ? Math.min(maxRowsToShow, 10) * 50 : 300}px]`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <Hash className="w-4 h-4 inline-block mr-1" /> №
                </TableHead>
                <TableHead>
                  <CalendarDays className="w-4 h-4 inline-block mr-1" /> Дата платежа
                </TableHead>
                <TableHead className="text-right">
                  <CircleDollarSign className="w-4 h-4 inline-block mr-1" /> Сумма (₸)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedSchedule.map((payment) => (
                <TableRow key={payment.paymentNumber}>
                  <TableCell className="font-medium">{payment.paymentNumber}</TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell className="text-right">{payment.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {maxRowsToShow && schedule.length > maxRowsToShow && (
          <p className="text-sm text-gray-500 mt-2">
            Показаны первые {maxRowsToShow} из {schedule.length} платежей.
            {/* Можно добавить кнопку "Показать все" */}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
