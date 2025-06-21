"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, Upload, X, Plus, CreditCard, Save, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const CAR_BRANDS = [
  "Toyota",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Hyundai",
  "Kia",
  "Nissan",
  "Honda",
  "Mazda",
  "Subaru",
  "Lexus",
  "Infiniti",
  "Mitsubishi",
  "Chevrolet",
  "Ford",
  "Renault",
  "Peugeot",
  "Skoda",
  "Lada",
  "UAZ",
]

const CITIES = ["Алматы", "Астана", "Шымкент", "Актобе", "Тараз", "Павлодар", "Усть-Каменогорск", "Семей"]

const FEATURES = [
  "Кондиционер",
  "Автоматическая коробка",
  "Механическая коробка",
  "Камера заднего вида",
  "Парктроник",
  "Подогрев сидений",
  "Кожаный салон",
  "Люк",
  "Навигация",
  "Bluetooth",
  "USB",
  "Круиз-контроль",
  "Электростеклоподъемники",
  "Центральный замок",
  "Сигнализация",
]

export default function AddCarPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    vin: "",
    licensePlate: "",
    rentalPrice: "",
    rentalPeriodMonths: "24",
    paymentFrequency: "monthly",
    location: "",
    description: "",
    mileage: "",
    fuelType: "gasoline",
    transmission: "automatic",
    engineVolume: "",
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (photos.length >= 6) {
      setMessage({ type: "error", text: "Максимум 6 фотографий" })
      return
    }

    setUploadingPhoto(true)
    try {
      // В реальном проекте здесь будет загрузка в Supabase Storage
      // Пока используем placeholder
      const photoUrl = `/placeholder.svg?height=300&width=400&text=Фото+${photos.length + 1}`
      setPhotos((prev) => [...prev, photoUrl])
      setMessage({ type: "success", text: "Фото добавлено!" })
    } catch (error) {
      setMessage({ type: "error", text: "Ошибка загрузки фото" })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setMessage({ type: "error", text: "Необходимо войти в аккаунт" })
      return
    }

    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const carData = {
        owner_id: user.id,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        color: formData.color,
        vin: formData.vin || null,
        license_plate: formData.licensePlate || null,
        rental_price: Number.parseFloat(formData.rentalPrice),
        rental_period_months: Number.parseInt(formData.rentalPeriodMonths),
        payment_frequency: formData.paymentFrequency,
        location: formData.location,
        description: formData.description,
        features: selectedFeatures,
        photos: photos,
        available: true,
        // Дополнительные поля
        mileage: formData.mileage ? Number.parseInt(formData.mileage) : null,
        fuel_type: formData.fuelType,
        transmission: formData.transmission,
        engine_volume: formData.engineVolume ? Number.parseFloat(formData.engineVolume) : null,
      }

      const { data, error } = await supabase.from("cars").insert(carData).select().single()

      if (error) throw error

      setMessage({ type: "success", text: "Автомобиль успешно добавлен!" })

      setTimeout(() => {
        router.push(`/car/${data.id}`)
      }, 2000)
    } catch (error) {
      console.error("Error adding car:", error)
      setMessage({ type: "error", text: "Ошибка при добавлении автомобиля" })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Вход требуется</h2>
            <p className="text-gray-600 mb-4">Для добавления автомобиля необходимо войти в аккаунт</p>
            <Link href="/login">
              <Button>Войти в аккаунт</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
              <span>Назад к кабинету</span>
            </Link>
            <h1 className="text-2xl font-bold">Добавить автомобиль</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {message.text && (
          <Alert
            className={`mb-6 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
          >
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={message.type === "error" ? "text-red-600" : "text-green-600"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Основная информация */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="w-5 h-5" />
                <span>Основная информация</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Марка автомобиля *</Label>
                  <Select value={formData.brand} onValueChange={(value) => handleInputChange("brand", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите марку" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAR_BRANDS.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Модель *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    placeholder="Например: Camry"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Год выпуска *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Цвет</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    placeholder="Например: Белый"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Пробег (км)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange("mileage", e.target.value)}
                    placeholder="150000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transmission">Коробка передач</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) => handleInputChange("transmission", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Автоматическая</SelectItem>
                      <SelectItem value="manual">Механическая</SelectItem>
                      <SelectItem value="cvt">Вариатор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelType">Тип топлива</Label>
                  <Select value={formData.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">Бензин</SelectItem>
                      <SelectItem value="diesel">Дизель</SelectItem>
                      <SelectItem value="hybrid">Гибрид</SelectItem>
                      <SelectItem value="electric">Электро</SelectItem>
                      <SelectItem value="gas">Газ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="engineVolume">Объем двигателя (л)</Label>
                  <Input
                    id="engineVolume"
                    type="number"
                    step="0.1"
                    value={formData.engineVolume}
                    onChange={(e) => handleInputChange("engineVolume", e.target.value)}
                    placeholder="2.0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Город *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите город" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Документы */}
          <Card>
            <CardHeader>
              <CardTitle>Документы (опционально)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN номер</Label>
                  <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => handleInputChange("vin", e.target.value)}
                    placeholder="1HGBH41JXMN109186"
                    maxLength={17}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licensePlate">Гос. номер</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                    placeholder="777ABC01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Условия аренды */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Условия аренды</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rentalPrice">Цена аренды (₸) *</Label>
                  <Input
                    id="rentalPrice"
                    type="number"
                    value={formData.rentalPrice}
                    onChange={(e) => handleInputChange("rentalPrice", e.target.value)}
                    placeholder="150000"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    {formData.paymentFrequency === "monthly"
                      ? "за месяц"
                      : formData.paymentFrequency === "weekly"
                        ? "за неделю"
                        : "за день"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentFrequency">Периодичность платежей</Label>
                  <Select
                    value={formData.paymentFrequency}
                    onValueChange={(value) => handleInputChange("paymentFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Ежемесячно</SelectItem>
                      <SelectItem value="weekly">Еженедельно</SelectItem>
                      <SelectItem value="six_times_week">6 раз в неделю</SelectItem>
                      <SelectItem value="daily">Ежедневно</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rentalPeriodMonths">Срок аренды (месяцев) *</Label>
                <Select
                  value={formData.rentalPeriodMonths}
                  onValueChange={(value) => handleInputChange("rentalPeriodMonths", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 месяцев</SelectItem>
                    <SelectItem value="18">18 месяцев</SelectItem>
                    <SelectItem value="24">24 месяца</SelectItem>
                    <SelectItem value="36">36 месяцев</SelectItem>
                    <SelectItem value="48">48 месяцев</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Расчет общей стоимости */}
              {formData.rentalPrice && formData.rentalPeriodMonths && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Расчет стоимости:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Ежемесячный платеж:</span>
                      <span className="font-bold">{Number.parseInt(formData.rentalPrice).toLocaleString()}₸</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Срок аренды:</span>
                      <span>{formData.rentalPeriodMonths} месяцев</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span>Общая сумма платежей:</span>
                      <span className="font-bold text-blue-600">
                        {(
                          Number.parseInt(formData.rentalPrice) * Number.parseInt(formData.rentalPeriodMonths)
                        ).toLocaleString()}
                        ₸
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Выкуп после всех платежей:</span>
                      <span className="font-bold text-green-600">1₸</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Фотографии */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Фотографии автомобиля</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Фото ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {photos.length < 6 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                    {uploadingPhoto ? (
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    ) : (
                      <>
                        <Plus className="w-6 h-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Добавить фото</span>
                      </>
                    )}
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">Добавьте до 6 фотографий. Первое фото будет основным.</p>
            </CardContent>
          </Card>

          {/* Особенности */}
          <Card>
            <CardHeader>
              <CardTitle>Особенности и комплектация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {FEATURES.map((feature) => (
                  <Badge
                    key={feature}
                    variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                    className="cursor-pointer justify-center py-2"
                    onClick={() => handleFeatureToggle(feature)}
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Описание */}
          <Card>
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Расскажите о состоянии автомобиля, особенностях, дополнительных условиях..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Кнопки */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Отменить
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.brand || !formData.model || !formData.rentalPrice || !formData.location}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Добавление...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Добавить автомобиль
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
