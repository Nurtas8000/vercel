"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react"

interface PaymentStats {
  totalPaid: number
  totalPending: number
  totalOverdue: number
  nextPaymentAmount: number
  nextPaymentDate: string
  completionPercentage: number
  monthlyAverage: number
}

interface PaymentDashboardProps {
  stats: PaymentStats
  onQuickPay: () => void
}

export function PaymentDashboard({ stats, onQuickPay }: PaymentDashboardProps) {
  const [timeUntilNext, setTimeUntilNext] = useState("")

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const nextDate = new Date(stats.nextPaymentDate)
      const diff = nextDate.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

        if (days > 0) {
          setTimeUntilNext(`${days} дней ${hours} часов`)
        } else {
          setTimeUntilNext(`${hours} часов`)
        }
      } else {
        setTimeUntilNext("Просрочен")
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Обновляем каждую минуту

    return () => clearInterval(interval)
  }, [stats.nextPaymentDate])

  return (
    <div className="space-y-6">
      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Оплачено</p>
                <p className="text-2xl font-bold text-green-800">{stats.totalPaid.toLocaleString()}₸</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">+12% от прошлого месяца</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Ожидает оплаты</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.totalPending.toLocaleString()}₸</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Calendar className="w-4 h-4 text-yellow-600 mr-1" />
              <span className="text-yellow-600">3 активных платежа</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Просрочено</p>
                <p className="text-2xl font-bold text-red-800">{stats.totalOverdue.toLocaleString()}₸</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              <span className="text-red-600">Требует внимания</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Средний платеж</p>
                <p className="text-2xl font-bold text-blue-800">{stats.monthlyAverage.toLocaleString()}₸</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CreditCard className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-blue-600">За месяц</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Следующий платеж */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Calendar className="w-5 h-5" />
              <span>Следующий платеж</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-600">Сумма:</span>
                <span className="text-2xl font-bold text-blue-800">{stats.nextPaymentAmount.toLocaleString()}₸</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-600">Срок:</span>
                <span className="font-medium text-blue-800">
                  {new Date(stats.nextPaymentDate).toLocaleDateString("ru-RU")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-600">Осталось:</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {timeUntilNext}
                </Badge>
              </div>

              <Button onClick={onQuickPay} className="w-full bg-blue-600 hover:bg-blue-700">
                Оплатить сейчас
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Прогресс выкупа */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Прогресс выкупа</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Выполнено</span>
                <span>{stats.completionPercentage.toFixed(1)}%</span>
              </div>

              <Progress value={stats.completionPercentage} className="h-3" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Оплачено:</span>
                  <div className="font-bold text-green-600">{stats.totalPaid.toLocaleString()}₸</div>
                </div>
                <div>
                  <span className="text-gray-600">Осталось:</span>
                  <div className="font-bold text-blue-600">
                    {(stats.totalPending + stats.totalOverdue).toLocaleString()}₸
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    После всех платежей автомобиль станет вашим за 1₸!
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
