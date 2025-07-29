"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Calendar, Users, Building2, Star, Shield, Clock } from "lucide-react"

export function HeroSection() {
  const [searchLocation, setSearchLocation] = useState("")
  const [activeTab, setActiveTab] = useState<"tenant" | "landlord">("tenant")

  const handleSearch = () => {
    if (activeTab === "tenant") {
      // Redirect to car catalog
      window.location.href = "/catalog"
    } else {
      // Redirect to landlord application
      window.location.href = "/become-landlord"
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
            🚗 Лидер лизинга в Казахстане
          </Badge>
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="text-4xl md:text-6xl block mb-4 text-gray-700 font-semibold">
              ДОЛГОСРОЧНАЯ АРЕНДА С ВЫКУПОМ
            </span>
            Автомобиль мечты
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              уже сегодня
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Долгосрочная аренда с правом выкупа. Минимальный взнос, гибкие условия, быстрое оформление. Ваш путь к
            собственному автомобилю начинается здесь.
          </p>
        </div>

        {/* Tab selector */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex bg-white rounded-2xl p-2 shadow-xl border border-gray-100">
            <button
              onClick={() => setActiveTab("tenant")}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "tenant"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Хочу взять в аренду</span>
            </button>
            <button
              onClick={() => setActiveTab("landlord")}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "landlord"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Хочу сдать автомобиль</span>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {activeTab === "tenant" ? (
              <div>
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
                  Найдите идеальный автомобиль для аренды
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      Город
                    </label>
                    <Input
                      placeholder="Алматы, Астана, Шымкент..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      Дата начала
                    </label>
                    <Input type="date" className="border-2 border-gray-200 focus:border-blue-500 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      Срок аренды
                    </label>
                    <select className="w-full p-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white">
                      <option>1 год</option>
                      <option>2 года</option>
                      <option>3 года</option>
                      <option>4 года</option>
                      <option>5 лет</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearch}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Найти авто
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-600">от 15%</div>
                    <div className="text-gray-600">Первоначальный взнос</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-600">до 5 лет</div>
                    <div className="text-gray-600">Срок лизинга</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-purple-600">24 часа</div>
                    <div className="text-gray-600">Одобрение заявки</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Зарабатывайте на своем автомобиле</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Высокий доход</h4>
                    <p className="text-gray-600 text-sm">До 300,000 ₸ в месяц с одного автомобиля</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Полная защита</h4>
                    <p className="text-gray-600 text-sm">КАСКО и техобслуживание за наш счет</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Без хлопот</h4>
                    <p className="text-gray-600 text-sm">Мы берем на себя все заботы об автомобиле</p>
                  </div>
                </div>
                <div className="text-center">
                  <Button
                    onClick={handleSearch}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 rounded-xl font-semibold shadow-lg text-lg"
                  >
                    Стать партнером
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
