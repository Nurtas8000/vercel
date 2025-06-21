"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Clock, CheckCircle, AlertCircle, Upload, Download, Search, ArrowLeft, Bell } from "lucide-react"
import Link from "next/link"
import { PaymentMethods } from "@/components/payment-methods"

interface Payment {
  id: string
  booking_id: string
  amount: number
  due_date: string
  paid_date?: string
  status: "pending" | "paid" | "overdue" | "failed"
  payment_method?: string
  receipt_url?: string
  kaspi_transaction_id?: string
  bookings?: {
    cars?: {
      brand: string
      model: string
      year: number
    }
  }
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const [filter, setFilter] = useState("all")

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchPayments()
    }
  }, [user])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          bookings (
            cars (
              brand,
              model,
              year
            )
          )
        `)
        .order("due_date", { ascending: true })

      if (error) throw error
      setPayments(data || [])
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentComplete = async (paymentId: string, transactionId: string) => {
    try {
      const { error } = await supabase
        .from("payments")
        .update({
          status: "paid",
          paid_date: new Date().toISOString(),
          kaspi_transaction_id: transactionId,
        })
        .eq("id", paymentId)

      if (error) throw error

      await fetchPayments()
      setShowPaymentForm(false)
      setSelectedPayment(null)
    } catch (error) {
      console.error("Error updating payment:", error)
    }
  }

  const handleReceiptUpload = async (paymentId: string, file: File) => {
    setUploadingReceipt(true)
    try {
      // В реальном проекте здесь будет загрузка в Supabase Storage
      const receiptUrl = `/receipts/${paymentId}_${file.name}`

      const { error } = await supabase.from("payments").update({ receipt_url: receiptUrl }).eq("id", paymentId)

      if (error) throw error

      await fetchPayments()
      alert("Чек успешно загружен!")
    } catch (error) {
      console.error("Error uploading receipt:", error)
      alert("Ошибка загрузки чека")
    } finally {
      setUploadingReceipt(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "failed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Оплачено"
      case "pending":
        return "Ожидает оплаты"
      case "overdue":
        return "Просрочено"
      case "failed":
        return "Ошибка"
      default:
        return status
    }
  }

  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true
    return payment.status === filter
  })

  const upcomingPayments = payments.filter(
    (p) => p.status === "pending" && new Date(p.due_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  )

  const overduePayments = payments.filter((p) => p.status === "overdue")

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Вход требуется</h2>
            <p className="text-gray-600 mb-4">Для просмотра платежей необходимо войти в аккаунт</p>
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
            <h1 className="text-2xl font-bold">Платежи</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Уведомления */}
        {(upcomingPayments.length > 0 || overduePayments.length > 0) && (
          <div className="mb-6 space-y-4">
            {overduePayments.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <div>
                      <div className="font-medium text-red-800">
                        У вас {overduePayments.length} просроченных платежей
                      </div>
                      <div className="text-sm text-red-700">Пожалуйста, погасите задолженность как можно скорее</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {upcomingPayments.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-6 h-6 text-yellow-600" />
                    <div>
                      <div className="font-medium text-yellow-800">
                        {upcomingPayments.length} платежей на этой неделе
                      </div>
                      <div className="text-sm text-yellow-700">Не забудьте внести платежи вовремя</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Статистика */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{payments.length}</div>
                  <div className="text-sm text-gray-600">Всего платежей</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {payments.filter((p) => p.status === "paid").length}
                  </div>
                  <div className="text-sm text-gray-600">Оплачено</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {payments.filter((p) => p.status === "pending").length}
                  </div>
                  <div className="text-sm text-gray-600">Ожидает</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {payments.filter((p) => p.status === "overdue").length}
                  </div>
                  <div className="text-sm text-gray-600">Просрочено</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Фильтры и поиск */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Поиск по автомобилю или дате..." className="pl-10" />
              </div>
              <Tabs value={filter} onValueChange={setFilter} className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">Все</TabsTrigger>
                  <TabsTrigger value="pending">Ожидает</TabsTrigger>
                  <TabsTrigger value="paid">Оплачено</TabsTrigger>
                  <TabsTrigger value="overdue">Просрочено</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Список платежей */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>История платежей</span>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="ml-2">Загрузка платежей...</span>
              </div>
            ) : filteredPayments.length > 0 ? (
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          payment.status === "paid"
                            ? "bg-green-100"
                            : payment.status === "overdue"
                              ? "bg-red-100"
                              : "bg-yellow-100"
                        }`}
                      >
                        {payment.status === "paid" ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : payment.status === "overdue" ? (
                          <AlertCircle className="w-6 h-6 text-red-600" />
                        ) : (
                          <Clock className="w-6 h-6 text-yellow-600" />
                        )}
                      </div>

                      <div>
                        <div className="font-medium">
                          {payment.bookings?.cars
                            ? `${payment.bookings.cars.brand} ${payment.bookings.cars.model} ${payment.bookings.cars.year}`
                            : "Автомобиль"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Срок: {new Date(payment.due_date).toLocaleDateString("ru-RU")}
                          {payment.paid_date && (
                            <span className="ml-2">
                              • Оплачено: {new Date(payment.paid_date).toLocaleDateString("ru-RU")}
                            </span>
                          )}
                        </div>
                        {payment.kaspi_transaction_id && (
                          <div className="text-xs text-gray-400">ID: {payment.kaspi_transaction_id}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">{payment.amount.toLocaleString()}₸</div>
                        <Badge className={getStatusColor(payment.status)}>{getStatusLabel(payment.status)}</Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        {payment.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment)
                              setShowPaymentForm(true)
                            }}
                          >
                            Оплатить
                          </Button>
                        )}

                        {payment.status === "paid" && payment.receipt_url && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}

                        {payment.status === "pending" && !payment.receipt_url && (
                          <div>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleReceiptUpload(payment.id, file)
                              }}
                              className="hidden"
                              id={`receipt-${payment.id}`}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => document.getElementById(`receipt-${payment.id}`)?.click()}
                              disabled={uploadingReceipt}
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              Чек
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Платежи не найдены</h3>
                <p className="text-gray-500">Измените фильтры или проверьте позже</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Модальное окно оплаты */}
        {showPaymentForm && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Оплата платежа</h2>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowPaymentForm(false)
                      setSelectedPayment(null)
                    }}
                  >
                    ✕
                  </Button>
                </div>

                <PaymentMethods
                  amount={selectedPayment.amount}
                  onPaymentSelect={(method) => console.log("Selected method:", method)}
                  onPaymentComplete={(transactionId) => handlePaymentComplete(selectedPayment.id, transactionId)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
