"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Users, CreditCard, Smartphone, Globe, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Полная безопасность",
      description: "Все сделки защищены, документы проверены, страхование включено",
      color: "green",
      benefits: ["Проверка документов", "Страхование", "Безопасные платежи"],
    },
    {
      icon: Zap,
      title: "Мгновенные платежи",
      description: "Интеграция с Kaspi Pay для быстрых и удобных платежей",
      color: "blue",
      benefits: ["Kaspi Pay", "QR-коды", "Автоплатежи"],
    },
    {
      icon: Users,
      title: "Сообщество владельцев",
      description: "Присоединяйтесь к 50,000+ довольных пользователей BnAuto",
      color: "purple",
      benefits: ["Отзывы", "Рейтинги", "Поддержка 24/7"],
    },
    {
      icon: CreditCard,
      title: "0% переплаты",
      description: "Никаких процентов, скрытых комиссий и дополнительных платежей",
      color: "orange",
      benefits: ["0% годовых", "Без комиссий", "Прозрачные условия"],
    },
    {
      icon: Smartphone,
      title: "Мобильное приложение",
      description: "Управляйте арендой, платежами и документами в одном приложении",
      color: "indigo",
      benefits: ["iOS & Android", "Push-уведомления", "Офлайн режим"],
    },
    {
      icon: Globe,
      title: "По всему Казахстану",
      description: "Работаем в крупных городах с планами расширения",
      color: "teal",
      benefits: ["Алматы", "Астана", "Шымкент"],
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">Преимущества платформы</Badge>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Почему выбирают BnAuto
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Современные технологии и инновационный подход к аренде автомобилей
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden"
            >
              <CardHeader className="relative">
                <div
                  className={`w-16 h-16 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-2">
                      <CheckCircle className={`w-4 h-4 text-${feature.color}-500`} />
                      <span className="text-sm text-gray-600 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Готовы начать?</h3>
          <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
            Присоединяйтесь к тысячам довольных пользователей и найдите свой идеальный автомобиль уже сегодня
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl group">
                Зарегистрироваться бесплатно
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/catalog">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Посмотреть каталог
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
