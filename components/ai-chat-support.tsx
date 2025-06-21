"use client"

import type React from "react"

import { useState } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User, Loader2, AlertCircle } from "lucide-react"

export function AIChatSupport() {
  const [isOpen, setIsOpen] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Привет! Я AI помощник BnAuto 🚗 Помогу вам с арендой автомобилей с правом выкупа. Задавайте любые вопросы!",
      },
    ],
    onError: (error) => {
      console.error("Chat error:", error)
    },
  })

  const quickQuestions = [
    "Как работает аренда с выкупом?",
    "Сколько стоит выкуп автомобиля?",
    "Какие документы нужны?",
    "Как происходит оплата?",
    "В каких городах работаете?",
  ]

  const handleQuickQuestion = (question: string) => {
    // Создаем синтетическое событие для отправки быстрого вопроса
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>

    // Устанавливаем значение input
    const inputElement = document.querySelector('input[placeholder="Напишите ваш вопрос..."]') as HTMLInputElement
    if (inputElement) {
      inputElement.value = question
      // Создаем событие изменения
      const changeEvent = new Event("input", { bubbles: true })
      inputElement.dispatchEvent(changeEvent)
    }

    // Отправляем форму
    handleSubmit(syntheticEvent, {
      data: { message: question },
    })
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <Badge className="absolute -top-2 -left-2 bg-green-500 text-white animate-pulse">AI</Badge>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-lg">BnAuto AI Помощник</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-1 text-sm opacity-90">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Онлайн • Отвечаю мгновенно</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border-b">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Ошибка подключения к AI. Попробуйте позже.</span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === "assistant" && <Bot className="w-4 h-4 mt-1 text-blue-600" />}
                    {message.role === "user" && <User className="w-4 h-4 mt-1" />}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Печатаю...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 mb-3">Популярные вопросы:</p>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start text-xs h-auto py-2 px-3 hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => handleQuickQuestion(question)}
                    disabled={isLoading}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Напишите ваш вопрос..."
                className="flex-1 rounded-full border-gray-300 focus:border-blue-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">AI может ошибаться. Проверяйте важную информацию.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
