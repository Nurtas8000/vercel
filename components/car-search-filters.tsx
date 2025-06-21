"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, MapPin, Calendar, CreditCard } from "lucide-react"

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void
  totalCars: number
  filteredCars: number
}

export function CarSearchFilters({ onFiltersChange, totalCars, filteredCars }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    city: "all",
    brand: "all",
    priceRange: [0, 500000],
    yearRange: [2010, 2025],
    paymentFrequency: "all",
    features: [] as string[],
  })

  const POPULAR_FEATURES = [
    "Кондиционер",
    "Автоматическая коробка",
    "Камера заднего вида",
    "Парктроник",
    "Подогрев сидений",
    "Bluetooth",
    "Навигация",
    "Круиз-контроль",
  ]

  const updateFilters = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter((f) => f !== feature)
      : [...filters.features, feature]
    updateFilters("features", newFeatures)
  }

  const resetFilters = () => {
    const defaultFilters = {
      search: "",
      city: "all",
      brand: "all",
      priceRange: [0, 500000],
      yearRange: [2010, 2025],
      paymentFrequency: "all",
      features: [],
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  return (
    <div className="space-y-4">
      {/* Основная строка поиска */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск по марке, модели, городу..."
            value={filters.search}
            onChange={(e) => updateFilters("search", e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="h-12 px-6">
          <Filter className="w-4 h-4 mr-2" />
          Фильтры
          {(filters.city !== "all" || filters.brand !== "all" || filters.features.length > 0) && (
            <Badge className="ml-2 bg-blue-500">
              {[filters.city !== "all" ? 1 : 0, filters.brand !== "all" ? 1 : 0, filters.features.length].reduce(
                (a, b) => a + b,
                0,
              )}
            </Badge>
          )}
        </Button>
      </div>

      {/* Результаты поиска */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Найдено <strong>{filteredCars}</strong> из {totalCars} автомобилей
        </span>
        {filteredCars !== totalCars && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Сбросить фильтры
          </Button>
        )}
      </div>

      {/* Расширенные фильтры */}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Фильтры поиска</span>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Локация и марка */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Город
                </Label>
                <Select value={filters.city} onValueChange={(value) => updateFilters("city", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все города</SelectItem>
                    <SelectItem value="Алматы">Алматы</SelectItem>
                    <SelectItem value="Астана">Астана</SelectItem>
                    <SelectItem value="Шымкент">Шымкент</SelectItem>
                    <SelectItem value="Актобе">Актобе</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Марка автомобиля</Label>
                <Select value={filters.brand} onValueChange={(value) => updateFilters("brand", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все марки</SelectItem>
                    <SelectItem value="Toyota">Toyota</SelectItem>
                    <SelectItem value="BMW">BMW</SelectItem>
                    <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                    <SelectItem value="Audi">Audi</SelectItem>
                    <SelectItem value="Hyundai">Hyundai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Цена */}
            <div className="space-y-3">
              <Label className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Цена аренды (₸/месяц)
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters("priceRange", value)}
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

            {/* Год выпуска */}
            <div className="space-y-3">
              <Label className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Год выпуска
              </Label>
              <Slider
                value={filters.yearRange}
                onValueChange={(value) => updateFilters("yearRange", value)}
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

            {/* Периодичность платежей */}
            <div className="space-y-2">
              <Label>Периодичность платежей</Label>
              <Select
                value={filters.paymentFrequency}
                onValueChange={(value) => updateFilters("paymentFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любая</SelectItem>
                  <SelectItem value="monthly">Ежемесячно</SelectItem>
                  <SelectItem value="weekly">Еженедельно</SelectItem>
                  <SelectItem value="daily">Ежедневно</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Особенности */}
            <div className="space-y-3">
              <Label>Особенности</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {POPULAR_FEATURES.map((feature) => (
                  <Badge
                    key={feature}
                    variant={filters.features.includes(feature) ? "default" : "outline"}
                    className="cursor-pointer justify-center py-2 text-xs"
                    onClick={() => toggleFeature(feature)}
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-4 pt-4 border-t">
              <Button variant="outline" onClick={resetFilters} className="flex-1">
                Сбросить все
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1">
                Применить фильтры
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
