"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  CarIcon,
  MapPin,
  Star,
  Search,
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  Loader2,
  Heart,
  Eye,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AuthHeader } from "@/components/auth-header"

const CITIES = ["Все города", "Алматы", "Астана", "Шымкент", "Актобе", "Тараз", "Павлодар"]
const BRANDS = ["Все марки", "Toyota", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Hyundai", "Kia"]
const PAYMENT_FREQUENCIES = [
  { value: "all", label: "Любая периодичность" },
  { value: "monthly", label: "Ежемесячно" },
  { value: "weekly", label: "Еженедельно" },
  { value: "daily", label: "Ежедневно" },
]

const SORT_OPTIONS = [
  { value: "newest", label: "Сначала новые" },
  { value: "price_low", label: "Цена: по возрастанию" },
  { value: "price_high", label: "Цена: по убыванию" },
  { value: "year_new", label: "Год: новые" },
  { value: "year_old", label: "Год: старые" },
  { value: "popular", label: "Популярные" },
]

interface Car {
  id: string
  brand: string
  model: string
  year: number
  color: string
  rental_price: number
  rental_period_months: number
  payment_frequency: string
  location: string
  photos: string[]
  features: string[]
  available: boolean
  mileage?: number
  fuel_type?: string
  transmission?: string
  users?: {
    full_name: string
    avatar_url?: string
  }
}

export default function CatalogPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  // Фильтры
  const [filters, setFilters] = useState({
    search: "",
    city: "all",
    brand: "all",
    paymentFrequency: "all",
    priceRange: [0, 500000],
    yearRange: [2010, 2025],
    transmission: "all",
    fuelType: "all",
    sortBy: "newest",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchCars()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [cars, filters])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(`
          *,
          users:owner_id (
            full_name,
            avatar_url
          )
        `)
        .eq("available", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setCars(data || [])
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...cars]

    // Поиск по тексту
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (car) =>
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower) ||
          car.location.toLowerCase().includes(searchLower),
      )
    }

    // Фильтр по городу
    if (filters.city !== "all") {
      filtered = filtered.filter((car) => car.location === filters.city)
    }

    // Фильтр по марке
    if (filters.brand !== "all") {
      filtered = filtered.filter((car) => car.brand === filters.brand)
    }

    // Фильтр по периодичности платежей
    if (filters.paymentFrequency !== "all") {
      filtered = filtered.filter((car) => car.payment_frequency === filters.paymentFrequency)
    }

    // Фильтр по цене
    filtered = filtered.filter(
      (car) => car.rental_price >= filters.priceRange[0] && car.rental_price <= filters.priceRange[1],
    )

    // Фильтр по году
    filtered = filtered.filter((car) => car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1])

    // Фильтр по коробке передач
    if (filters.transmission !== "all") {
      filtered = filtered.filter((car) => car.transmission === filters.transmission)
    }

    // Фильтр по типу топлива
    if (filters.fuelType !== "all") {
      filtered = filtered.filter((car) => car.fuel_type === filters.fuelType)
    }

    // Сортировка
    switch (filters.sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.rental_price - b.rental_price)
        break
      case "price_high":
        filtered.sort((a, b) => b.rental_price - a.rental_price)
        break
      case "year_new":
        filtered.sort((a, b) => b.year - a.year)
        break
      case "year_old":
        filtered.sort((a, b) => a.year - b.year)
        break
      case "popular":
        // Можно добавить логику популярности
        break
      default: // newest
        break
    }

    setFilteredCars(filtered)
  }

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      city: "all",
      brand: "all",
      paymentFrequency: "all",
      priceRange: [0, 500000],
      yearRange: [2010, 2025],
      transmission: "all",
      fuelType: "all",
      sortBy: "newest",
    })
  }

  const toggleFavorite = (carId: string) => {
    setFavorites((prev) => (prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]))
  }

  const getTransmissionLabel = (transmission: string) => {
    switch (transmission) {
      case "automatic":
        return "Автомат"
      case "manual":
        return "Механика"
      case "cvt":
        return "Вариатор"
      default:
        return transmission
    }
  }

  const getFuelTypeLabel = (fuelType: string) => {
    switch (fuelType) {
      case "gasoline":
        return "Бензин"
      case "diesel":
        return "Дизель"
      case "hybrid":
        return "Гибрид"
      case "electric":
        return "Электро"
      case "gas":
        return "Газ"
      default:
        return fuelType
    }
  }

  const getPaymentFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "monthly":
        return "мес"
      case "weekly":
        return "нед"
      case "daily":
        return "день"
      case "six_times_week":
        return "6р/нед"
      default:
        return frequency
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BnAuto
              </span>
            </Link>
            <AuthHeader />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Заголовок и статистика */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Каталог автомобилей</h1>
          <p className="text-gray-600">
            Найдено {filteredCars.length} из {cars.length} автомобилей для аренды с правом выкупа
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="mb-6 space-y-4">
          {/* Строка поиска */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Поиск по марке, модели или городу..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 px-4">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="h-12 px-4"
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Быстрые фильтры */}
          <div className="flex flex-wrap gap-2">
            <Select value={filters.city} onValueChange={(value) => updateFilter("city", value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city === "Все города" ? "all" : city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.brand} onValueChange={(value) => updateFilter("brand", value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRANDS.map((brand) => (
                  <SelectItem key={brand} value={brand === "Все марки" ? "all" : brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Расширенные фильтры */}
          {showFilters && (
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Цена */}
                <div className="space-y-3">
                  <Label>Цена аренды (₸/мес)</Label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilter("priceRange", value)}
                    max={500000}
                    min={0}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filters.priceRange[0].toLocaleString()}₸</span>
                    <span>{filters.priceRange[1].toLocaleString()}₸</span>
                  </div>
                </div>

                {/* Год */}
                <div className="space-y-3">
                  <Label>Год выпуска</Label>
                  <Slider
                    value={filters.yearRange}
                    onValueChange={(value) => updateFilter("yearRange", value)}
                    max={2025}
                    min={2010}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filters.yearRange[0]}</span>
                    <span>{filters.yearRange[1]}</span>
                  </div>
                </div>

                {/* Коробка передач */}
                <div className="space-y-3">
                  <Label>Коробка передач</Label>
                  <Select value={filters.transmission} onValueChange={(value) => updateFilter("transmission", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любая</SelectItem>
                      <SelectItem value="automatic">Автоматическая</SelectItem>
                      <SelectItem value="manual">Механическая</SelectItem>
                      <SelectItem value="cvt">Вариатор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Тип топлива */}
                <div className="space-y-3">
                  <Label>Тип топлива</Label>
                  <Select value={filters.fuelType} onValueChange={(value) => updateFilter("fuelType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любой</SelectItem>
                      <SelectItem value="gasoline">Бензин</SelectItem>
                      <SelectItem value="diesel">Дизель</SelectItem>
                      <SelectItem value="hybrid">Гибрид</SelectItem>
                      <SelectItem value="electric">Электро</SelectItem>
                      <SelectItem value="gas">Газ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Периодичность платежей */}
                <div className="space-y-3">
                  <Label>Периодичность платежей</Label>
                  <Select
                    value={filters.paymentFrequency}
                    onValueChange={(value) => updateFilter("paymentFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_FREQUENCIES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Кнопка сброса */}
                <div className="flex items-end">
                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Сбросить фильтры
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Результаты */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Загрузка автомобилей...</span>
          </div>
        ) : filteredCars.length > 0 ? (
          <div
            className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
          >
            {filteredCars.map((car) => (
              <Card
                key={car.id}
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <div className={`relative ${viewMode === "list" ? "w-64 h-48" : "h-48"} bg-gray-200`}>
                  <Image
                    src={car.photos?.[0] || "/placeholder.svg?height=200&width=300"}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-green-500 text-white">Выкуп за 1₸</Badge>
                    {car.year >= 2022 && <Badge className="bg-blue-500 text-white">Новый</Badge>}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                      onClick={() => toggleFavorite(car.id)}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(car.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="secondary" className="bg-white/80">
                      <Eye className="w-3 h-3 mr-1" />
                      {Math.floor(Math.random() * 50) + 10}
                    </Badge>
                  </div>
                </div>

                <CardContent className={`${viewMode === "list" ? "flex-1" : ""} p-4`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg leading-tight">
                      {car.brand} {car.model} {car.year}
                    </h3>
                    <div className="flex items-center ml-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{car.location}</span>
                  </div>

                  {/* Характеристики */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {car.mileage && (
                      <Badge variant="outline" className="text-xs">
                        {car.mileage.toLocaleString()} км
                      </Badge>
                    )}
                    {car.transmission && (
                      <Badge variant="outline" className="text-xs">
                        {getTransmissionLabel(car.transmission)}
                      </Badge>
                    )}
                    {car.fuel_type && (
                      <Badge variant="outline" className="text-xs">
                        {getFuelTypeLabel(car.fuel_type)}
                      </Badge>
                    )}
                  </div>

                  {/* Особенности */}
                  {car.features && car.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {car.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {car.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{car.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        Аренда/{getPaymentFrequencyLabel(car.payment_frequency)}:
                      </span>
                      <span className="font-bold text-blue-600 text-lg">{car.rental_price?.toLocaleString()}₸</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Срок аренды:</span>
                      <span className="font-bold text-green-600">{car.rental_period_months} мес</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Владелец:</span>
                      <span className="text-sm font-medium">{car.users?.full_name || "Не указан"}</span>
                    </div>
                  </div>

                  <Link href={`/car/${car.id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Арендовать с выкупом
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Автомобили не найдены</h3>
            <p className="text-gray-500 mb-4">Попробуйте изменить параметры поиска или сбросить фильтры</p>
            <Button onClick={resetFilters} variant="outline">
              Сбросить фильтры
            </Button>
          </div>
        )}

        {/* Пагинация (можно добавить позже) */}
        {filteredCars.length > 12 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline">Показать еще</Button>
          </div>
        )}
      </div>
    </div>
  )
}
