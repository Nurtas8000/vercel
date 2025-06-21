"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Car, Calculator, Smartphone, CheckCircle, Sparkles, Gift } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Gift className="w-4 h-4 mr-2" />
            Специальное предложение
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Начните свой путь к владению автомобилем уже сегодня
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Присоединяйтесь к тысячам довольных клиентов и получите автомобиль мечты без переплат и процентов
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Найти автомобиль</h3>
              <p className="text-blue-100 mb-4">Выберите из 15,000+ проверенных автомобилей</p>
              <Link href="/catalog">
                <Button className="bg-blue-600 hover:bg-blue-700 group">
                  Открыть каталог
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Рассчитать платежи</h3>
              <p className="text-blue-100 mb-4">Узнайте точную стоимость аренды с выкупом</p>
              <Link href="/payment-calculator">
                <Button className="bg-purple-600 hover:bg-purple-700 group">
                  Калькулятор
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Скачать приложение</h3>
              <p className="text-blue-100 mb-4">Управляйте арендой в мобильном приложении</p>
              <Button className="bg-green-600 hover:bg-green-700" disabled>
                Скоро в App Store
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-yellow-300 mr-3" />
            <h3 className="text-3xl font-bold">Получите консультацию бесплатно</h3>
            <Sparkles className="w-8 h-8 text-yellow-300 ml-3" />
          </div>

          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Наши эксперты помогут подобрать идеальный автомобиль и рассчитают индивидуальные условия аренды с выкупом
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl group">
                <CheckCircle className="w-5 h-5 mr-2" />
                Зарегистрироваться бесплатно
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Связаться с консультантом
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {["Бесплатная консультация", "Подбор автомобиля", "Расчет платежей", "Оформление за 1 день"].map(
              (feature, index) => (
                <div key={index} className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-blue-100">{feature}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-blue-200 mb-4">Есть вопросы? Мы всегда готовы помочь!</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-blue-300" />
              <span className="text-blue-100">+7 (777) 123-45-67</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-100">support@bnauto.kz</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-100">Работаем 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
