"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Car, TrendingUp, Shield, Clock, Phone, MessageCircle } from "lucide-react"

export function UserTypeSelector() {
  const [selectedType, setSelectedType] = useState<"tenant" | "landlord" | null>(null)

  const handleQuickCall = () => {
    window.open("tel:+77271234567")
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/77271234567", "_blank")
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="block text-2xl md:text-3xl text-blue-600 font-bold mb-2">
              ДОЛГОСРОЧНАЯ АРЕНДА С ВЫКУПОМ
            </span>
            Выберите свой путь
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы предлагаем индивидуальные решения для каждого клиента
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* For Tenants */}
          <Card
            className={`cursor-pointer transition-all duration-500 hover:shadow-2xl border-2 transform hover:-translate-y-2 ${
              selectedType === "tenant"
                ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl scale-105"
                : "border-gray-200 hover:border-blue-300 bg-white"
            }`}
            onClick={() => setSelectedType(selectedType === "tenant" ? null : "tenant")}
          >
            <CardContent className="p-10 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Users className="w-12 h-12 text-white" />
              </div>
              <Badge className="mb-6 bg-blue-600 text-white px-4 py-2 text-sm">Для арендаторов</Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Хочу взять авто в лизинг</h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Car className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Новые автомобили с гарантией</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Первоначальный взнос от 15%</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Полное КАСКО включено</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Одобрение за 24 часа</span>
                </div>
              </div>

              <Button
                size="lg"
                className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                  selectedType === "tenant"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                }`}
              >
                Выбрать автомобиль
              </Button>
            </CardContent>
          </Card>

          {/* For Landlords */}
          <Card
            className={`cursor-pointer transition-all duration-500 hover:shadow-2xl border-2 transform hover:-translate-y-2 ${
              selectedType === "landlord"
                ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-xl scale-105"
                : "border-gray-200 hover:border-green-300 bg-white"
            }`}
            onClick={() => setSelectedType(selectedType === "landlord" ? null : "landlord")}
          >
            <CardContent className="p-10 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <Badge className="mb-6 bg-green-600 text-white px-4 py-2 text-sm">Для владельцев</Badge>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Хочу сдать авто в лизинг</h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Доход до 300,000 ₸/месяц</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Полное страхование за наш счет</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Car className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Техобслуживание включено</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Гарантированные выплаты</span>
                </div>
              </div>

              <Button
                size="lg"
                className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                  selectedType === "landlord"
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                }`}
              >
                Стать партнером
              </Button>
            </CardContent>
          </Card>
        </div>

        {selectedType && (
          <div className="mt-12 animate-fade-in">
            <Card className="bg-gradient-to-r from-white to-gray-50 shadow-2xl border-0">
              <CardContent className="p-10 text-center">
                <h3 className="text-3xl font-bold mb-6 text-gray-900">
                  {selectedType === "tenant"
                    ? "🎉 Отлично! Давайте подберем вам автомобиль"
                    : "🤝 Отлично! Давайте обсудим сотрудничество"}
                </h3>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  {selectedType === "tenant"
                    ? "Наши менеджеры свяжутся с вами в течение 15 минут для подбора идеального автомобиля и расчета индивидуальных условий"
                    : "Наши менеджеры свяжутся с вами для обсуждения условий партнерства и расчета потенциального дохода от вашего автомобиля"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={handleQuickCall}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Позвонить сейчас
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleWhatsApp}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp чат
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
