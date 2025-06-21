"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Асылбек Нурланов",
      role: "Предприниматель",
      city: "Алматы",
      rating: 5,
      text: "Благодаря BnAuto я смог получить автомобиль для бизнеса без огромного первоначального взноса. Через 2 года Toyota Camry стала полностью моей за символическую цену!",
      car: "Toyota Camry 2023",
      savings: "450,000₸",
      avatar: "AN",
    },
    {
      name: "Айгуль Сериковна",
      role: "Врач",
      city: "Астана",
      rating: 5,
      text: "Очень удобная система платежей через Kaspi Pay. Никаких процентов, все прозрачно. Рекомендую всем, кто хочет стать владельцем автомобиля без переплат.",
      car: "Hyundai Solaris 2024",
      savings: "320,000₸",
      avatar: "АС",
    },
    {
      name: "Данияр Абдуллаев",
      role: "IT-специалист",
      city: "Шымкент",
      rating: 5,
      text: "Отличная альтернатива автокредиту! 0% годовых - это реально работает. Поддержка отвечает быстро, все вопросы решаются оперативно.",
      car: "BMW X3 2023",
      savings: "890,000₸",
      avatar: "ДА",
    },
    {
      name: "Алия Касымова",
      role: "Дизайнер",
      city: "Алматы",
      rating: 5,
      text: "Мне понравилось, что можно выбрать удобную периодичность платежей. Плачу еженедельно небольшими суммами, и это очень комфортно для семейного бюджета.",
      car: "Kia Sportage 2024",
      savings: "520,000₸",
      avatar: "АК",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentTestimonial]

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">Отзывы клиентов</Badge>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Что говорят наши клиенты
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Реальные истории людей, которые стали владельцами автомобилей через BnAuto
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Testimonial Content */}
                <div className="p-8 md:p-12">
                  <Quote className="w-12 h-12 text-blue-500 mb-6" />

                  <div className="flex items-center mb-4">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                    "{current.text}"
                  </blockquote>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {current.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{current.name}</div>
                      <div className="text-gray-600">
                        {current.role} • {current.city}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">Автомобиль</div>
                      <div className="font-bold text-blue-800">{current.car}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">Сэкономил</div>
                      <div className="font-bold text-green-800">{current.savings}</div>
                    </div>
                  </div>
                </div>

                {/* Visual Side */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 md:p-12 flex flex-col justify-center items-center text-white">
                  <div className="text-center mb-8">
                    <div className="text-6xl font-bold mb-2">{current.rating}.0</div>
                    <div className="text-blue-100">из 5 звезд</div>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                      <div className="text-sm opacity-90">Экономия на процентах</div>
                      <div className="text-2xl font-bold">{current.savings}</div>
                    </div>

                    <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                      <div className="text-sm opacity-90">Статус</div>
                      <div className="text-lg font-bold">Владелец автомобиля</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button variant="outline" size="sm" onClick={prevTestimonial} className="rounded-full w-12 h-12 p-0">
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-blue-600 w-8" : "bg-blue-300 hover:bg-blue-400"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={nextTestimonial} className="rounded-full w-12 h-12 p-0">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stats from testimonials */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">2.1M₸</div>
            <div className="text-gray-700 font-medium">Средняя экономия</div>
            <div className="text-sm text-gray-500">на процентах и переплатах</div>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.9</div>
            <div className="text-gray-700 font-medium">Средний рейтинг</div>
            <div className="text-sm text-gray-500">от наших клиентов</div>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
            <div className="text-gray-700 font-medium">Довольных клиентов</div>
            <div className="text-sm text-gray-500">рекомендуют BnAuto</div>
          </div>
        </div>
      </div>
    </section>
  )
}
