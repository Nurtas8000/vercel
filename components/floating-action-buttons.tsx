"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Calculator, Mail } from "lucide-react"

export function FloatingActionButtons() {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCall = () => {
    window.open("tel:+77271234567")
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/77271234567?text=Здравствуйте! Интересует лизинг автомобиля", "_blank")
  }

  const handleCalculator = () => {
    window.open("/calculator", "_blank")
  }

  const handleEmail = () => {
    window.open("mailto:info@bnlease.kz?subject=Заявка на лизинг")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end space-y-3">
        {isExpanded && (
          <>
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white shadow-xl border-2 border-green-500 transition-all duration-300 hover:scale-105"
              onClick={handleCall}
            >
              <Phone className="w-5 h-5 mr-2" />
              Позвонить
            </Button>
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl border-2 border-emerald-500 transition-all duration-300 hover:scale-105"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-xl border-2 border-purple-500 transition-all duration-300 hover:scale-105"
              onClick={handleCalculator}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Калькулятор
            </Button>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl border-2 border-blue-500 transition-all duration-300 hover:scale-105"
              onClick={handleEmail}
            >
              <Mail className="w-5 h-5 mr-2" />
              Email
            </Button>
          </>
        )}

        <Button
          size="lg"
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-2xl rounded-full w-16 h-16 border-4 border-white transition-all duration-300 hover:scale-110"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-2xl">{isExpanded ? "✕" : "☰"}</span>
        </Button>
      </div>
    </div>
  )
}
