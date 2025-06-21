import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, CreditCard, User, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BookingForm } from "@/components/booking-form"
import { PaymentScheduleDisplay } from "@/components/payment-schedule-display" // Импортируем новый компонент

interface CarPageProps {
  params: {
    id: string
  }
}

export default async function CarPage({ params }: CarPageProps) {
  const supabase = await createClient()

  const { data: car, error } = await supabase
    .from("cars")
    .select(`
      *,
      users:owner_id (
        full_name,
        phone,
        avatar_url
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Автомобиль не найден</h1>
          <Link href="/catalog">
            <Button>Вернуться к каталогу</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getPaymentFrequencyLabel = (frequency: string | undefined | null) => {
    switch (frequency) {
      case "daily":
        return "Ежедневный платеж"
      case "weekly":
        return "Еженедельный платеж"
      case "monthly":
        return "Ежемесячный платеж"
      case "six_times_week":
        return "Платеж (6 раз в неделю)"
      default:
        return "Регулярный платеж"
    }
  }

  const getTermLabel = (frequency: string | undefined | null, numberOfPayments: number | undefined | null) => {
    if (!numberOfPayments) return "Не указан"
    switch (frequency) {
      case "daily":
        return `${numberOfPayments} дней`
      case "weekly":
        return `${numberOfPayments} недель`
      case "monthly":
        return `${numberOfPayments} месяцев`
      case "six_times_week": {
        const weeks = Math.ceil(numberOfPayments / 6)
        return `${numberOfPayments} платежей (~${weeks} нед.)`
      }
      default:
        return `${numberOfPayments} платежей`
    }
  }

  // Убедимся, что car.payment_frequency и car.number_of_payments существуют и имеют правильный тип
  const paymentFrequency = car.payment_frequency as "daily" | "weekly" | "monthly" | "six_times_week" | undefined
  const numberOfPayments = car.number_of_payments

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/catalog" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-5 h-5" />
            <span>Назад к каталогу</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Фото автомобиля */}
          <div className="space-y-4">
            <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={car.photos?.[0] || "/placeholder.svg?height=400&width=600"}
                alt={`${car.brand} ${car.model}`}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-green-500">Выкуп за 1₸</Badge>
            </div>

            {car.photos && car.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {car.photos.slice(1, 5).map((photo: string, index: number) => (
                  <div key={index} className="relative h-20 bg-gray-200 rounded overflow-hidden">
                    <Image src={photo || "/placeholder.svg"} alt={`Фото ${index + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Информация об автомобиле */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {car.brand} {car.model} {car.year}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{car.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span>4.8 (12 отзывов)</span> {/* Placeholder */}
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Владелец</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {car.users?.avatar_url ? (
                      <Image
                        src={car.users.avatar_url || "/placeholder.svg"}
                        alt={car.users.full_name || "avatar"}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{car.users?.full_name || "Имя не указано"}</div>
                    {/* <div className="text-sm text-gray-500">Владелец с 2023 года</div> Placeholder */}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Условия аренды с выкупом</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">{getPaymentFrequencyLabel(paymentFrequency)}</div>
                    <div className="text-2xl font-bold text-blue-600">{car.rental_price?.toLocaleString()}₸</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Срок аренды</div>
                    <div className="text-2xl font-bold text-green-600">
                      {getTermLabel(paymentFrequency, numberOfPayments)}
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Выкуп после всех платежей:</span>
                    <span className="font-bold text-green-600">1₸</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Периодичность платежей:</span>
                    <span className="font-medium">
                      {paymentFrequency === "monthly"
                        ? "Ежемесячно"
                        : paymentFrequency === "weekly"
                          ? "Еженедельно"
                          : paymentFrequency === "daily"
                            ? "Ежедневно"
                            : paymentFrequency === "six_times_week"
                              ? "6 раз в неделю"
                              : "Не указана"}
                    </span>
                  </div>
                  {numberOfPayments && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600">Всего платежей по графику:</span>
                      <span className="font-medium">{numberOfPayments}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {car.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Описание</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{car.description}</p>
                </CardContent>
              </Card>
            )}

            {car.features && car.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Особенности</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Интеграция графика платежей */}
            {paymentFrequency && numberOfPayments && car.rental_price && (
              <PaymentScheduleDisplay
                rentalPrice={car.rental_price}
                paymentFrequency={paymentFrequency}
                numberOfPayments={numberOfPayments}
                startDate={new Date()} // Для примера, начинаем с сегодняшнего дня
                maxRowsToShow={5} // Показываем первые 5 платежей для превью
              />
            )}

            <BookingForm car={car} />
          </div>
        </div>
      </div>
    </div>
  )
}
