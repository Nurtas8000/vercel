import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Calendar, Plus } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Получаем бронирования пользователя (упрощенно - все бронирования)
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      cars (
        brand,
        model,
        year,
        photos,
        rental_price
      ),
      payments (
        amount,
        due_date,
        status,
        paid_date
      )
    `)
    .order("created_at", { ascending: false })

  // Получаем автомобили пользователя (упрощенно - все автомобили)
  const { data: userCars } = await supabase.from("cars").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold">BnAuto</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/catalog">
                <Button variant="outline">Каталог</Button>
              </Link>
              <Link href="/add-car">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить авто
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
          <p className="text-gray-600">Управляйте своими автомобилями и бронированиями</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Мои бронирования */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Мои бронирования ({bookings?.length || 0})
            </h2>

            <div className="space-y-4">
              {bookings && bookings.length > 0 ? (
                bookings.map((booking: any) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold">
                            {booking.cars?.brand} {booking.cars?.model} {booking.cars?.year}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.start_date).toLocaleDateString()} -{" "}
                            {new Date(booking.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            booking.status === "active"
                              ? "default"
                              : booking.status === "confirmed"
                                ? "secondary"
                                : booking.status === "completed"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {booking.status === "active"
                            ? "Активно"
                            : booking.status === "confirmed"
                              ? "Подтверждено"
                              : booking.status === "completed"
                                ? "Завершено"
                                : booking.status === "pending"
                                  ? "Ожидает"
                                  : "Отменено"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Общая сумма:</span>
                          <div className="font-bold">{booking.total_amount?.toLocaleString()}₸</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Платежей:</span>
                          <div className="font-bold">
                            {booking.payments?.filter((p: any) => p.status === "paid").length || 0} /{" "}
                            {booking.payments?.length || 0}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Следующий платеж:</span>
                          <div className="text-right">
                            {booking.payments?.find((p: any) => p.status === "pending") ? (
                              <>
                                <div className="font-bold text-blue-600">
                                  {booking.payments.find((p: any) => p.status === "pending").amount?.toLocaleString()}₸
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(
                                    booking.payments.find((p: any) => p.status === "pending").due_date,
                                  ).toLocaleDateString()}
                                </div>
                              </>
                            ) : (
                              <span className="text-green-600 font-bold">Все оплачено!</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-600 mb-2">Нет активных бронирований</h3>
                    <p className="text-gray-500 mb-4">Найдите автомобиль в каталоге</p>
                    <Link href="/catalog">
                      <Button>Перейти к каталогу</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Мои автомобили */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Мои автомобили ({userCars?.length || 0})
            </h2>

            <div className="space-y-4">
              {userCars && userCars.length > 0 ? (
                userCars.map((car: any) => (
                  <Card key={car.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold">
                            {car.brand} {car.model} {car.year}
                          </h3>
                          <p className="text-sm text-gray-600">{car.location}</p>
                        </div>
                        <Badge variant={car.available ? "default" : "secondary"}>
                          {car.available ? "Доступен" : "Арендован"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Цена аренды:</span>
                          <div className="font-bold">{car.rental_price?.toLocaleString()}₸/мес</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Срок аренды:</span>
                          <div className="font-bold">{car.rental_period_months} месяцев</div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Редактировать
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Статистика
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-600 mb-2">Нет автомобилей</h3>
                    <p className="text-gray-500 mb-4">Добавьте свой первый автомобиль</p>
                    <Link href="/add-car">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить автомобиль
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
