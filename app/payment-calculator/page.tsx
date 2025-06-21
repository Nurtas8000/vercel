"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calculator,
  Calendar,
  CreditCard,
  TrendingUp,
  PiggyBank,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Sparkles,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { AuthHeader } from "@/components/auth-header"
import { Car } from "lucide-react" // Import the Car component

interface PaymentSchedule {
  month: number
  date: string
  amount: number
  principal: number
  interest: number
  balance: number
  status: "pending" | "paid" | "overdue"
}

export default function PaymentCalculatorPage() {
  const [carPrice, setCarPrice] = useState(3000000)
  const [downPayment, setDownPayment] = useState(0)
  const [loanTerm, setLoanTerm] = useState(24)
  const [paymentFrequency, setPaymentFrequency] = useState("monthly")
  const [interestRate, setInterestRate] = useState(0)

  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalPayments, setTotalPayments] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([])

  useEffect(() => {
    calculatePayments()
  }, [carPrice, downPayment, loanTerm, paymentFrequency, interestRate])

  const calculatePayments = () => {
    const principal = carPrice - downPayment
    const paymentsPerYear = getPaymentsPerYear()
    const totalPaymentsCount = loanTerm * (paymentsPerYear / 12)

    const payment = principal / totalPaymentsCount

    setMonthlyPayment(payment)
    setTotalPayments(payment * totalPaymentsCount)
    setTotalInterest(0)

    generatePaymentSchedule(payment, totalPaymentsCount, principal)
  }

  const getPaymentsPerYear = () => {
    switch (paymentFrequency) {
      case "daily":
        return 365
      case "six_times_week":
        return 312
      case "weekly":
        return 52
      case "monthly":
        return 12
      default:
        return 12
    }
  }

  const getPaymentFrequencyLabel = () => {
    switch (paymentFrequency) {
      case "daily":
        return "день"
      case "six_times_week":
        return "6 раз в неделю"
      case "weekly":
        return "неделю"
      case "monthly":
        return "месяц"
      default:
        return "месяц"
    }
  }

  const generatePaymentSchedule = (payment: number, totalPayments: number, principal: number) => {
    const schedule: PaymentSchedule[] = []
    let remainingBalance = principal
    const startDate = new Date()

    for (let i = 1; i <= Math.min(totalPayments, 60); i++) {
      const paymentDate = new Date(startDate)

      switch (paymentFrequency) {
        case "daily":
          paymentDate.setDate(startDate.getDate() + i)
          break
        case "six_times_week":
          const daysToAdd = Math.floor(i / 6) * 7 + (i % 6)
          paymentDate.setDate(startDate.getDate() + daysToAdd)
          break
        case "weekly":
          paymentDate.setDate(startDate.getDate() + i * 7)
          break
        case "monthly":
          paymentDate.setMonth(startDate.getMonth() + i)
          break
      }

      remainingBalance -= payment

      schedule.push({
        month: i,
        date: paymentDate.toLocaleDateString("ru-RU"),
        amount: payment,
        principal: payment,
        interest: 0,
        balance: Math.max(0, remainingBalance),
        status: i <= 3 ? "paid" : i <= 5 ? "pending" : "pending",
      })
    }

    setPaymentSchedule(schedule)
  }

  const exportSchedule = () => {
    alert("Функция экспорта будет добавлена в следующем обновлении")
  }

  const shareCalculation = () => {
    const url = `${window.location.origin}/payment-calculator?price=${carPrice}&term=${loanTerm}&frequency=${paymentFrequency}`
    navigator.clipboard.writeText(url)
    alert("Ссылка на расчет скопирована в буфер обмена")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BnAuto
              </span>
            </Link>
            <AuthHeader />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Умный калькулятор платежей
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Рассчитайте свой путь к владению автомобилем
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Интерактивный калькулятор поможет точно рассчитать стоимость аренды с правом выкупа и создать персональный
            график платежей
          </p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="calculator" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Калькулятор</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>График</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Сравнение</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Parameters */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span>Параметры расчета</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Car Price */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Стоимость автомобиля</Label>
                      <Input
                        type="number"
                        value={carPrice}
                        onChange={(e) => setCarPrice(Number(e.target.value))}
                        className="text-lg font-bold h-12"
                      />
                      <Slider
                        value={[carPrice]}
                        onValueChange={(value) => setCarPrice(value[0])}
                        max={10000000}
                        min={500000}
                        step={100000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>500,000₸</span>
                        <span className="font-bold text-blue-600">{carPrice.toLocaleString()}₸</span>
                        <span>10,000,000₸</span>
                      </div>
                    </div>

                    {/* Down Payment */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Первоначальный взнос</Label>
                      <Input
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="h-12"
                      />
                      <Slider
                        value={[downPayment]}
                        onValueChange={(value) => setDownPayment(value[0])}
                        max={carPrice * 0.5}
                        min={0}
                        step={50000}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-500">
                        {((downPayment / carPrice) * 100).toFixed(1)}% от стоимости
                      </div>
                    </div>

                    {/* Loan Term */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Срок аренды</Label>
                      <Select value={loanTerm.toString()} onValueChange={(value) => setLoanTerm(Number(value))}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 месяцев (1 год)</SelectItem>
                          <SelectItem value="18">18 месяцев</SelectItem>
                          <SelectItem value="24">24 месяца (2 года)</SelectItem>
                          <SelectItem value="36">36 месяцев (3 года)</SelectItem>
                          <SelectItem value="48">48 месяцев (4 года)</SelectItem>
                          <SelectItem value="60">60 месяцев (5 лет)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Payment Frequency */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Периодичность платежей</Label>
                      <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                        <SelectTrigger className="h-12">
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

                    {/* BnAuto Benefits */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-800">Преимущества BnAuto</span>
                      </div>
                      <ul className="text-sm text-green-700 space-y-2">
                        <li className="flex items-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span>0% годовых (без процентов)</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>Выкуп за 1₸ после всех платежей</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Без скрытых комиссий</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <ArrowRight className="w-4 h-4" />
                          <span>Досрочное погашение без штрафов</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-4 space-y-3">
                    <Button onClick={exportSchedule} variant="outline" className="w-full h-12">
                      <Download className="w-4 h-4 mr-2" />
                      Скачать график
                    </Button>
                    <Button onClick={shareCalculation} variant="outline" className="w-full h-12">
                      <Share2 className="w-4 h-4 mr-2" />
                      Поделиться расчетом
                    </Button>
                    <Link href="/catalog">
                      <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Car className="w-4 h-4 mr-2" />
                        Найти автомобиль
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="lg:col-span-2 space-y-6">
                {/* Summary Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-blue-800">Платеж</h3>
                          <p className="text-sm text-blue-600">за {getPaymentFrequencyLabel()}</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-blue-800 mb-2">
                        {monthlyPayment.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}₸
                      </div>
                      <div className="text-sm text-blue-600">
                        {paymentFrequency === "monthly" ? "в месяц" : `за ${getPaymentFrequencyLabel()}`}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <PiggyBank className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-800">Общая сумма</h3>
                          <p className="text-sm text-green-600">всех платежей</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-green-800 mb-2">
                        {totalPayments.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}₸
                      </div>
                      <div className="text-sm text-green-600">+ выкуп за 1₸</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Calculation */}
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Детали расчета</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Стоимость автомобиля:</span>
                          <span className="font-bold">{carPrice.toLocaleString()}₸</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Первоначальный взнос:</span>
                          <span className="font-bold">{downPayment.toLocaleString()}₸</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Сумма к финансированию:</span>
                          <span className="font-bold">{(carPrice - downPayment).toLocaleString()}₸</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-gray-600">Срок аренды:</span>
                          <span className="font-bold">{loanTerm} месяцев</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Количество платежей:</span>
                          <span className="font-bold">{Math.round(loanTerm * (getPaymentsPerYear() / 12))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Процентная ставка:</span>
                          <span className="font-bold text-green-600">0% годовых</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Переплата:</span>
                          <span className="font-bold text-green-600">0₸</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-gray-600">Выкуп:</span>
                          <span className="font-bold text-green-600">1₸</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Прогресс выплат (демо)</span>
                        <span>3 из {Math.round(loanTerm * (getPaymentsPerYear() / 12))} платежей</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(3 / Math.round(loanTerm * (getPaymentsPerYear() / 12))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>График платежей</span>
                  </div>
                  <Badge variant="secondary">
                    Показано {Math.min(paymentSchedule.length, 12)} из {paymentSchedule.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {paymentSchedule.slice(0, 12).map((payment, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                        payment.status === "paid"
                          ? "bg-green-50 border-green-200"
                          : payment.status === "overdue"
                            ? "bg-red-50 border-red-200"
                            : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            payment.status === "paid"
                              ? "bg-green-500 text-white"
                              : payment.status === "overdue"
                                ? "bg-red-500 text-white"
                                : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {payment.month}
                        </div>
                        <div>
                          <div className="font-medium">{payment.date}</div>
                          <div className="text-sm text-gray-500">
                            {payment.status === "paid"
                              ? "Оплачено"
                              : payment.status === "overdue"
                                ? "Просрочено"
                                : "Ожидает оплаты"}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {payment.amount.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}₸
                        </div>
                        <div className="text-sm text-gray-500">
                          Остаток: {payment.balance.toLocaleString("ru-RU", { maximumFractionDigits: 0 })}₸
                        </div>
                      </div>

                      <div className="flex items-center">
                        {payment.status === "paid" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : payment.status === "overdue" ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {paymentSchedule.length > 12 && (
                  <div className="text-center mt-6">
                    <Button variant="outline">Показать все {paymentSchedule.length} платежей</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-green-800">BnAuto (Аренда с выкупом)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Ежемесячный платеж:</span>
                    <span className="font-bold text-green-600">{monthlyPayment.toLocaleString()}₸</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Процентная ставка:</span>
                    <span className="font-bold text-green-600">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Общая переплата:</span>
                    <span className="font-bold text-green-600">0₸</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Итого к выплате:</span>
                    <span className="font-bold text-green-600">{totalPayments.toLocaleString()}₸</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Выкуп автомобиля:</span>
                    <span className="font-bold text-green-600">1₸</span>
                  </div>
                  <Separator />
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-800">
                      Экономия: {(carPrice * 0.15).toLocaleString()}₸
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-red-800">Обычный автокредит</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Ежемесячный платеж:</span>
                    <span className="font-bold text-red-600">{(monthlyPayment * 1.3).toLocaleString()}₸</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Процентная ставка:</span>
                    <span className="font-bold text-red-600">15-20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Общая переплата:</span>
                    <span className="font-bold text-red-600">{(carPrice * 0.15).toLocaleString()}₸</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Итого к выплате:</span>
                    <span className="font-bold text-red-600">{(totalPayments * 1.15).toLocaleString()}₸</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Первоначальный взнос:</span>
                    <span className="font-bold text-red-600">{(carPrice * 0.2).toLocaleString()}₸</span>
                  </div>
                  <Separator />
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-red-800">
                      Переплата: {(carPrice * 0.15).toLocaleString()}₸
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Готовы начать?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Найдите идеальный автомобиль в нашем каталоге и начните путь к владению уже сегодня
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Car className="w-5 h-5 mr-2" />
                Найти автомобиль
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Зарегистрироваться
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
