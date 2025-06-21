"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Trash2 } from "lucide-react"

export function SupabaseTestClient() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    year: 2024,
    rental_price: 100000,
    location: "Алматы",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("cars").select("*").limit(10)

      if (error) throw error
      setCars(data || [])
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTestCar = async () => {
    if (!newCar.brand || !newCar.model) return

    setAdding(true)
    try {
      const { data, error } = await supabase
        .from("cars")
        .insert({
          ...newCar,
          owner_id: "550e8400-e29b-41d4-a716-446655440001", // Тестовый пользователь
          rental_period_months: 24,
          payment_frequency: "monthly",
          available: true,
        })
        .select()
        .single()

      if (error) throw error

      setCars([data, ...cars])
      setNewCar({
        brand: "",
        model: "",
        year: 2024,
        rental_price: 100000,
        location: "Алматы",
      })
    } catch (error) {
      console.error("Error adding car:", error)
      alert("Ошибка добавления автомобиля")
    } finally {
      setAdding(false)
    }
  }

  const deleteCar = async (id: string) => {
    try {
      const { error } = await supabase.from("cars").delete().eq("id", id)

      if (error) throw error

      setCars(cars.filter((car) => car.id !== id))
    } catch (error) {
      console.error("Error deleting car:", error)
      alert("Ошибка удаления автомобиля")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Тест клиентских операций</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Форма добавления */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <Input
            placeholder="Марка"
            value={newCar.brand}
            onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
          />
          <Input
            placeholder="Модель"
            value={newCar.model}
            onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Год"
            value={newCar.year}
            onChange={(e) => setNewCar({ ...newCar, year: Number.parseInt(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Цена"
            value={newCar.rental_price}
            onChange={(e) => setNewCar({ ...newCar, rental_price: Number.parseInt(e.target.value) })}
          />
          <Button onClick={addTestCar} disabled={adding}>
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Добавить
          </Button>
        </div>

        {/* Список автомобилей */}
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Загрузка...</span>
            </div>
          ) : cars.length > 0 ? (
            cars.map((car) => (
              <div key={car.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">
                    {car.brand} {car.model} {car.year}
                  </div>
                  <div className="text-sm text-gray-500">
                    {car.rental_price?.toLocaleString()}₸/мес • {car.location}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={car.available ? "default" : "secondary"}>
                    {car.available ? "Доступен" : "Занят"}
                  </Badge>
                  <Button size="sm" variant="destructive" onClick={() => deleteCar(car.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">Нет автомобилей. Добавьте тестовый автомобиль выше.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
