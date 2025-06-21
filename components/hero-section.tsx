"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Car, TrendingUp, Sparkles, ArrowRight, Calculator } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Арендуй сегодня,",
      subtitle: "владей завтра",
      description: "Инновационная платформа аренды автомобилей с правом выкупа",
      gradient: "from-blue-600 via-purple-600 to-pink-600",
      accentGradient: "from-orange-500 to-red-500",
    },
    {
      title: "0% годовых,",
      subtitle: "выкуп за 1₸",
      description: "Никаких процентов, скрытых комиссий и переплат",
      gradient: "from-green-600 via-emerald-600 to-teal-600",
      accentGradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "15,000+ авто,",
      subtitle: "50,000+ довольных клиентов",
      description: "Крупнейшая платформа аренды с выкупом в Казахстане",
      gradient: "from-purple-600 via-indigo-600 to-blue-600",
      accentGradient: "from-pink-500 to-purple-500",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const currentSlideData = slides[currentSlide]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg animate-pulse">
          <Sparkles className="w-4 h-4 mr-2" />
          Новинка 2025: Аренда с правом выкупа
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span
            className={`bg-gradient-to-r ${currentSlideData.gradient} bg-clip-text text-transparent transition-all duration-1000`}
          >
            {currentSlideData.title}
          </span>
          <br />
          <span
            className={`bg-gradient-to-r ${currentSlideData.accentGradient} bg-clip-text text-transparent transition-all duration-1000`}
          >
            {currentSlideData.subtitle}
          </span>
        </h1>

        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000">
          {currentSlideData.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/catalog">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all group"
            >
              <Car className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Найти автомобиль
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/payment-calculator">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 text-lg px-8 py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all group"
            >
              <Calculator className="w-5 h-5 mr-2 group-hover:animate-spin" />
              Калькулятор платежей
            </Button>
          </Link>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2 mb-12">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-purple-600 w-8" : "bg-purple-300 hover:bg-purple-400"
              }`}
            />
          ))}
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: "15K+", label: "Автомобилей", icon: Car, color: "blue" },
            { value: "50K+", label: "Пользователей", icon: TrendingUp, color: "purple" },
            { value: "0%", label: "Процентов", icon: Sparkles, color: "green" },
            { value: "1₸", label: "Выкуп", icon: Car, color: "orange" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`w-8 h-8 mx-auto mb-2 rounded-full bg-${stat.color}-100 flex items-center justify-center`}
                >
                  <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                </div>
                <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
