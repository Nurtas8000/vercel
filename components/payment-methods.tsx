"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Smartphone, Building2, QrCode, Shield, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface PaymentMethodsProps {
  amount: number
  onPaymentSelect: (method: string) => void
  onPaymentComplete: (transactionId: string) => void
}

export function PaymentMethods({ amount, onPaymentSelect, onPaymentComplete }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [processing, setProcessing] = useState(false)
  const [kaspiPhone, setKaspiPhone] = useState("")

  const paymentMethods = [
    {
      id: "kaspi_pay",
      name: "Kaspi Pay",
      description: "Мгновенная оплата через приложение Kaspi",
      icon: <Smartphone className="w-6 h-6" />,
      fee: 0,
      processingTime: "Мгновенно",
      popular: true,
      available: true,
    },
    {
      id: "kaspi_qr",
      name: "Kaspi QR",
      description: "Сканирование QR-кода в приложении",
      icon: <QrCode className="w-6 h-6" />,
      fee: 0,
      processingTime: "Мгновенно",
      popular: false,
      available: true,
    },
    {
      id: "bank_transfer",
      name: "Банковский перевод",
      description: "Перевод на расчетный счет",
      icon: <Building2 className="w-6 h-6" />,
      fee: 0,
      processingTime: "1-2 рабочих дня",
      popular: false,
      available: true,
    },
    {
      id: "card_payment",
      name: "Банковская карта",
      description: "Visa, MasterCard, МИР",
      icon: <CreditCard className="w-6 h-6" />,
      fee: amount * 0.02, // 2% комиссия
      processingTime: "Мгновенно",
      popular: false,
      available: false, // Пока недоступно
    },
  ]

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    onPaymentSelect(methodId)
  }

  const handleKaspiPayment = async () => {
    if (!kaspiPhone) {
      alert("Введите номер телефона Kaspi")
      return
    }

    setProcessing(true)

    try {
      // Имитация API запроса к Kaspi Pay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Генерируем mock transaction ID
      const transactionId = `KP${Date.now()}`

      onPaymentComplete(transactionId)
      alert(`Платеж успешно обработан! ID транзакции: ${transactionId}`)
    } catch (error) {
      alert("Ошибка при обработке платежа")
    } finally {
      setProcessing(false)
    }
  }

  const handleQRPayment = () => {
    // Генерируем QR код для оплаты
    const qrData = {
      amount: amount,
      merchant: "BnAuto",
      description: "Платеж по аренде автомобиля",
    }

    alert("QR-код для оплаты будет сгенерирован")
  }

  const handleBankTransfer = () => {
    // Показываем реквизиты для перевода
    const bankDetails = `
Получатель: ТОО "BnAuto"
БИК: KKMFKZ2A
ИИК: KZ123456789012345678
Назначение платежа: Аренда автомобиля, сумма: ${amount.toLocaleString()}₸
    `

    navigator.clipboard.writeText(bankDetails)
    alert("Реквизиты скопированы в буфер обмена")
  }

  return (
    <div className="space-y-6">
      {/* Сумма к оплате */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-sm text-blue-600 mb-2">Сумма к оплате</div>
            <div className="text-4xl font-bold text-blue-800 mb-2">{amount.toLocaleString()}₸</div>
            <div className="text-sm text-blue-600">Платеж по договору аренды с выкупом</div>
          </div>
        </CardContent>
      </Card>

      {/* Способы оплаты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Выберите способ оплаты</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : method.available
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
              }`}
              onClick={() => method.available && handleMethodSelect(method.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedMethod === method.id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {method.icon}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{method.name}</span>
                      {method.popular && <Badge className="bg-green-500 text-white">Популярный</Badge>}
                      {!method.available && <Badge variant="secondary">Скоро</Badge>}
                    </div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{method.processingTime}</span>
                      </div>
                      {method.fee > 0 && (
                        <div className="text-xs text-orange-600">Комиссия: {method.fee.toLocaleString()}₸</div>
                      )}
                      {method.fee === 0 && <div className="text-xs text-green-600">Без комиссии</div>}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedMethod === method.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}
                >
                  {selectedMethod === method.id && <CheckCircle className="w-5 h-5 text-white" />}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Форма оплаты для выбранного метода */}
      {selectedMethod === "kaspi_pay" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <span>Оплата через Kaspi Pay</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kaspi-phone">Номер телефона Kaspi</Label>
              <Input
                id="kaspi-phone"
                type="tel"
                placeholder="+7 (777) 123-45-67"
                value={kaspiPhone}
                onChange={(e) => setKaspiPhone(e.target.value)}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-blue-800 mb-1">Безопасная оплата</div>
                  <div className="text-blue-600">
                    Платеж будет обработан через защищенное соединение Kaspi Pay. Ваши данные надежно защищены.
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleKaspiPayment}
              disabled={!kaspiPhone || processing}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Обработка платежа...
                </>
              ) : (
                <>Оплатить {amount.toLocaleString()}₸</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedMethod === "kaspi_qr" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="w-5 h-5" />
              <span>Оплата по QR-коду</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              <div className="text-sm text-gray-600 mb-4">Отсканируйте QR-код в приложении Kaspi для оплаты</div>
              <Button onClick={handleQRPayment} variant="outline">
                Сгенерировать QR-код
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedMethod === "bank_transfer" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Банковский перевод</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-yellow-800 mb-1">Важно</div>
                  <div className="text-yellow-700">
                    Обработка банковского перевода может занять 1-2 рабочих дня. Обязательно укажите назначение платежа.
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Получатель:</span>
                  <div className="font-medium">ТОО "BnAuto"</div>
                </div>
                <div>
                  <span className="text-gray-600">БИК:</span>
                  <div className="font-medium">KKMFKZ2A</div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">ИИК:</span>
                  <div className="font-medium">KZ123456789012345678</div>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Назначение платежа:</span>
                  <div className="font-medium">Аренда автомобиля, сумма: {amount.toLocaleString()}₸</div>
                </div>
              </div>
            </div>

            <Button onClick={handleBankTransfer} variant="outline" className="w-full">
              Скопировать реквизиты
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Информация о безопасности */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-green-600" />
            <div>
              <div className="font-medium text-green-800">Безопасные платежи</div>
              <div className="text-sm text-green-700">
                Все платежи защищены SSL-шифрованием и соответствуют стандартам PCI DSS
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
