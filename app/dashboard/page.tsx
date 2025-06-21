import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Здесь в будущем будет логика для получения данных пользователя
  // Например, активные бронирования, платежи и т.д.

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Личный кабинет</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Добро пожаловать, {user.user_metadata?.full_name || user.email}!</h2>
          <p className="text-gray-600">Здесь вы можете управлять своими автомобилями, бронированиями и платежами.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-blue-600" />
                <span>Мои автомобили</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Просматривайте и управляйте вашими автомобилями, выставленными на аренду.
              </p>
              <Button variant="outline" asChild>
                <Link href="/my-cars">Управлять</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span>Мои бронирования</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Отслеживайте статус ваших текущих и прошлых аренд.</p>
              <Button variant="outline" asChild>
                <Link href="/my-bookings">Смотреть</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <span>Мои платежи</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Просматривайте историю платежей и управляйте предстоящими оплатами.</p>
              <Button variant="outline" asChild>
                <Link href="/payments">К платежам</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
