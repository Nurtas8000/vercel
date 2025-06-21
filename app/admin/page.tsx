"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Car, FileText, Shield, CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminStats {
  totalUsers: number
  totalCars: number
  totalBookings: number
  totalRevenue: number
  pendingVerifications: number
  activeRentals: number
}

interface User {
  id: string
  email: string
  full_name: string
  phone: string
  role: string
  verified: boolean
  created_at: string
}

interface CarData {
  id: string
  brand: string
  model: string
  year: number
  rental_price: number
  available: boolean
  owner_id: string
  users: { full_name: string }
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    activeRentals: 0,
  })
  const [users, setUsers] = useState<User[]>([])
  const [cars, setCars] = useState<CarData[]>([])

  const supabase = createClient()

  useEffect(() => {
    checkAdminAccess()
  }, [user])

  const checkAdminAccess = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    try {
      const { data, error } = await supabase.from("users").select("is_admin, role").eq("id", user.id).single()

      if (error || !data?.is_admin) {
        router.push("/dashboard")
        return
      }

      setIsAdmin(true)
      await loadAdminData()
    } catch (error) {
      console.error("Error checking admin access:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const loadAdminData = async () => {
    try {
      // Загружаем статистику
      const [usersResult, carsResult, bookingsResult] = await Promise.all([
        supabase.from("users").select("*", { count: "exact" }),
        supabase.from("cars").select("*", { count: "exact" }),
        supabase.from("bookings").select("*", { count: "exact" }),
      ])

      // Загружаем пользователей
      const { data: usersData } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      // Загружаем автомобили
      const { data: carsData } = await supabase
        .from("cars")
        .select(`
          *,
          users:owner_id (full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(50)

      setStats({
        totalUsers: usersResult.count || 0,
        totalCars: carsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalRevenue: 0, // Будет рассчитано позже
        pendingVerifications: usersData?.filter((u) => !u.verified).length || 0,
        activeRentals: 0, // Будет рассчитано позже
      })

      setUsers(usersData || [])
      setCars(carsData || [])
    } catch (error) {
      console.error("Error loading admin data:", error)
    }
  }

  const toggleUserVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("users").update({ verified: !currentStatus }).eq("id", userId)

      if (!error) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, verified: !currentStatus } : u)))
      }
    } catch (error) {
      console.error("Error updating user verification:", error)
    }
  }

  const toggleCarAvailability = async (carId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("cars").update({ available: !currentStatus }).eq("id", carId)

      if (!error) {
        setCars(cars.map((c) => (c.id === carId ? { ...c, available: !currentStatus } : c)))
      }
    } catch (error) {
      console.error("Error updating car availability:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p>Проверка прав доступа...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>У вас нет прав доступа к админ панели</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Админ панель BnAuto</h1>
                <p className="text-gray-600">Управление платформой</p>
              </div>
            </div>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              Вернуться в кабинет
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Пользователи</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Автомобили</p>
                  <p className="text-3xl font-bold">{stats.totalCars}</p>
                </div>
                <Car className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Бронирования</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ожидают верификации</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingVerifications}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Основной контент */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="cars">Автомобили</TabsTrigger>
            <TabsTrigger value="bookings">Бронирования</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          {/* Пользователи */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-500">{user.phone}</p>
                          </div>
                          <Badge variant={user.role === "owner" ? "default" : "secondary"}>
                            {user.role === "owner" ? "Владелец" : "Арендатор"}
                          </Badge>
                          {user.verified ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Верифицирован
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="w-3 h-3 mr-1" />
                              Не верифицирован
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={user.verified ? "destructive" : "default"}
                          onClick={() => toggleUserVerification(user.id, user.verified)}
                        >
                          {user.verified ? "Отозвать" : "Верифицировать"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Автомобили */}
          <TabsContent value="cars">
            <Card>
              <CardHeader>
                <CardTitle>Управление автомобилями</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cars.map((car) => (
                    <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">
                              {car.brand} {car.model} ({car.year})
                            </p>
                            <p className="text-sm text-gray-600">Владелец: {car.users?.full_name}</p>
                            <p className="text-sm text-gray-500">{car.rental_price} ₸/месяц</p>
                          </div>
                          <Badge variant={car.available ? "default" : "secondary"}>
                            {car.available ? "Доступен" : "Недоступен"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={car.available ? "destructive" : "default"}
                          onClick={() => toggleCarAvailability(car.id, car.available)}
                        >
                          {car.available ? "Скрыть" : "Показать"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Бронирования */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Управление бронированиями</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Список бронирований будет загружен...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Аналитика */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Рост пользователей</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">График будет добавлен позже</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Доходы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    График доходов будет добавлен позже
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
