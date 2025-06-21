import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Database, Users, Car, Calendar } from "lucide-react"
import { SupabaseTestClient } from "@/components/supabase-test-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function TestSupabasePage() {
  const supabase = await createClient()

  // Тестируем подключение к БД
  let connectionStatus = "error"
  let users = []
  let cars = []
  let bookings = []
  let error = null

  try {
    // Проверяем подключение
    const { data: connectionTest, error: connectionError } = await supabase.from("users").select("count").limit(1)

    if (connectionError) {
      throw connectionError
    }

    connectionStatus = "success"

    // Получаем пользователей
    const { data: usersData, error: usersError } = await supabase.from("users").select("*").limit(5)

    if (!usersError) {
      users = usersData || []
    }

    // Получаем автомобили
    const { data: carsData, error: carsError } = await supabase
      .from("cars")
      .select(`
        *,
        users:owner_id (
          full_name
        )
      `)
      .limit(5)

    if (!carsError) {
      cars = carsData || []
    }

    // Получаем бронирования
    const { data: bookingsData, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        *,
        cars (brand, model),
        users:renter_id (full_name)
      `)
      .limit(5)

    if (!bookingsError) {
      bookings = bookingsData || []
    }
  } catch (err: any) {
    error = err.message
    connectionStatus = "error"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Тест Supabase интеграции</h1>
            <p className="text-gray-600">Проверка подключения к базе данных BnAuto</p>
          </div>
          <Link href="/">
            <Button variant="outline">← Назад на главную</Button>
          </Link>
        </div>

        {/* Статус подключения */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Статус подключения</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {connectionStatus === "success" ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Badge className="bg-green-100 text-green-800">Подключено</Badge>
                  <span className="text-sm text-gray-600">База данных доступна</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <Badge className="bg-red-100 text-red-800">Ошибка</Badge>
                  <span className="text-sm text-red-600">{error}</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {connectionStatus === "success" && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Пользователи */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Пользователи</span>
                    <Badge>{users.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {users.length > 0 ? (
                      users.map((user: any) => (
                        <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-sm">{user.full_name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                          <Badge variant={user.verified ? "default" : "secondary"}>{user.role}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Нет пользователей</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Автомобили */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="w-5 h-5" />
                    <span>Автомобили</span>
                    <Badge>{cars.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cars.length > 0 ? (
                      cars.map((car: any) => (
                        <div key={car.id} className="p-2 bg-gray-50 rounded">
                          <div className="font-medium text-sm">
                            {car.brand} {car.model} {car.year}
                          </div>
                          <div className="text-xs text-gray-500">
                            {car.rental_price?.toLocaleString()}₸/мес • {car.location}
                          </div>
                          <div className="text-xs text-blue-600">Владелец: {car.users?.full_name}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Нет автомобилей</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Бронирования */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Бронирования</span>
                    <Badge>{bookings.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bookings.length > 0 ? (
                      bookings.map((booking: any) => (
                        <div key={booking.id} className="p-2 bg-gray-50 rounded">
                          <div className="font-medium text-sm">
                            {booking.cars?.brand} {booking.cars?.model}
                          </div>
                          <div className="text-xs text-gray-500">{booking.users?.full_name}</div>
                          <div className="flex items-center justify-between mt-1">
                            <Badge
                              variant={
                                booking.status === "active"
                                  ? "default"
                                  : booking.status === "confirmed"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {booking.status}
                            </Badge>
                            <span className="text-xs text-green-600">{booking.total_amount?.toLocaleString()}₸</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Нет бронирований</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Клиентский тест */}
            <SupabaseTestClient />
          </>
        )}

        {/* Environment Variables Check */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Проверка конфигурации</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
                </div>
                <div className="flex items-center space-x-2">
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  <strong>URL:</strong>{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_URL
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`
                    : "Не настроен"}
                </div>
                <div className="text-xs text-gray-500">
                  <strong>Key:</strong>{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
                    : "Не настроен"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Инструкции по исправлению */}
        {connectionStatus === "error" && (
          <Card className="mt-6 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Как исправить ошибки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Проверьте environment variables</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Убедитесь что в файле <code>.env.local</code> есть:
                </p>
                <pre className="bg-gray-100 p-2 rounded text-xs">
                  {`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`}
                </pre>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Создайте таблицы в Supabase</h4>
                <p className="text-sm text-gray-600">Выполните SQL скрипты в Supabase SQL Editor:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  <li>scripts/create-database-schema.sql</li>
                  <li>scripts/seed-sample-data.sql</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Перезапустите сервер</h4>
                <p className="text-sm text-gray-600">После изменения .env.local выполните:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs">npm run dev</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
