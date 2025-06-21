"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Car, Star, DollarSign, Globe } from "lucide-react"

export function StatsSection() {
  const [counters, setCounters] = useState({
    cars: 0,
    users: 0,
    satisfaction: 0,
    savings: 0,
  })

  const finalValues = {
    cars: 15420,
    users: 52300,
    satisfaction: 98,
    savings: 2500000,
  }

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    const intervals = Object.keys(finalValues).map((key) => {
      const finalValue = finalValues[key as keyof typeof finalValues]
      const increment = finalValue / steps

      return setInterval(() => {
        setCounters((prev) => ({
          ...prev,
          [key]: Math.min(prev[key as keyof typeof prev] + increment, finalValue),
        }))
      }, stepDuration)
    })

    setTimeout(() => {
      intervals.forEach(clearInterval)
      setCounters(finalValues)
    }, duration)

    return () => intervals.forEach(clearInterval)
  }, [])

  const stats = [
    {
      icon: Car,
      value: Math.floor(counters.cars).toLocaleString(),
      suffix: "+",
      label: "Автомобилей в каталоге",
      description: "Все марки и модели",
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      value: Math.floor(counters.users).toLocaleString(),
      suffix: "+",
      label: "Активных пользователей",
      description: "По всему Казахстану",
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Star,
      value: Math.floor(counters.satisfaction),
      suffix: "%",
      label: "Довольных клиентов",
      description: "Высокий рейтинг сервиса",
      color: "green",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: DollarSign,
      value: (Math.floor(counters.savings) / 1000000).toFixed(1),
      suffix: "M₸",
      label: "Сэкономлено клиентами",
      description: "Благодаря 0% переплаты",
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">BnAuto в цифрах</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Наши достижения говорят сами за себя</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 bg-gradient-to-br from-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                <div className={`text-3xl md:text-4xl font-bold text-${stat.color}-600 mb-2`}>
                  {stat.value}
                  {stat.suffix}
                </div>

                <div className="text-gray-800 font-semibold mb-1">{stat.label}</div>

                <div className="text-sm text-gray-500">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-800 mb-1">3</div>
            <div className="text-blue-700 font-medium">Крупных города</div>
            <div className="text-sm text-blue-600">Алматы, Астана, Шымкент</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-800 mb-1">24/7</div>
            <div className="text-green-700 font-medium">Поддержка клиентов</div>
            <div className="text-sm text-green-600">AI чат-бот + операторы</div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <Star className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-800 mb-1">4.9</div>
            <div className="text-purple-700 font-medium">Средний рейтинг</div>
            <div className="text-sm text-purple-600">Из 5 звезд в отзывах</div>
          </div>
        </div>
      </div>
    </section>
  )
}
