"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, MapPin, Eye, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CarCardProps {
  car: {
    id: string
    brand: string
    model: string
    year: number
    rental_price: number
    rental_period_months: number
    payment_frequency: string
    location: string
    photos: string[]
    features: string[]
    mileage?: number
    transmission?: string
    fuel_type?: string
    users?: {
      full_name: string
    }
  }
  viewMode?: "grid" | "list"
  onFavoriteToggle?: (carId: string) => void
  isFavorite?: boolean
}

export function CarCard({ car, viewMode = "grid", onFavoriteToggle, isFavorite = false }: CarCardProps) {
  const [imageLoading, setImageLoading] = useState(true)

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${car.brand} ${car.model} ${car.year}`,
          text: `Аренда с выкупом за ${car.rental_price.toLocaleString()}₸/мес`,
          url: `/car/${car.id}`,
        })
      } catch (error) {
        console.log("Sharing failed:", error)
      }
    } else {
      // Fallback - копируем ссылку
      navigator.clipboard.writeText(`${window.location.origin}/car/${car.id}`)
    }
  }

  return (
    <Card
      className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${
        viewMode === "list" ? "flex" : ""
      }`}
    >
      {/* Изображение */}
      <div className={`relative ${viewMode === "list" ? "w-64 h-48" : "h-48"} bg-gray-200`}>
        <Image
          src={car.photos?.[0] || "/placeholder.svg?height=200&width=300"}
          alt={`${car.brand} ${car.model}`}
          fill
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImageLoading(false)}
        />

        {/* Загрузка изображения */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-green-500 text-white shadow-lg">Выкуп за 1₸</Badge>
          {car.year >= 2022 && <Badge className="bg-blue-500 text-white shadow-lg">Новый</Badge>}
        </div>

        {/* Действия */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 bg-white/80 hover:bg-white shadow-lg"
            onClick={() => onFavoriteToggle?.(car.id)}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 bg-white/80 hover:bg-white shadow-lg"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Просмотры */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="secondary" className="bg-white/80 shadow-lg">
            <Eye className="w-3 h-3 mr-1" />
            {Math.floor(Math.random() * 50) + 10}
          </Badge>
        </div>
      </div>

      {/* Контент */}
      <CardContent className={`${viewMode === "list" ? "flex-1" : ""} p-4`}>
        {/* Заголовок */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg leading-tight">
            {car.brand} {car.model} {car.year}
          </h3>
          <div className="flex items-center ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.8</span>
          </div>
        </div>

        {/* Локация */}
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

        {/* Цены и условия */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Аренда/{getPaymentFrequencyLabel(car.payment_frequency)}:</span>
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

        {/* Кнопка действия */}
        <Link href={`/car/${car.id}`}>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
            Арендовать с выкупом
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
