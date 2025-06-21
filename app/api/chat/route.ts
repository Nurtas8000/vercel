import type { NextRequest } from "next/server"

// Fallback если нет AI SDK
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Проверяем наличие OpenAI API ключа
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key не настроен. Добавьте OPENAI_API_KEY в environment variables.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Пытаемся использовать AI SDK
    try {
      const { openai } = await import("@ai-sdk/openai")
      const { streamText } = await import("ai")

      const result = await streamText({
        model: openai("gpt-4o"),
        system: `Ты AI помощник платформы BnAuto - сервиса аренды автомобилей с правом выкупа в Казахстане.

КЛЮЧЕВАЯ ИНФОРМАЦИЯ О BNAUTO:
- Платформа аренды авто между частными лицами
- Уникальная модель: аренда с правом выкупа
- После оплаты ВСЕХ арендных платежей автомобиль выкупается за символическую цену 1₸
- Срок аренды устанавливает арендодатель
- Варианты оплаты: ежедневно, 6 раз в неделю, еженедельно, ежемесячно
- Работаем в городах: Алматы, Астана, Шымкент
- Валюта: тенге (₸)
- Интеграция с Kaspi Pay для оплаты

ТВОИ ЗАДАЧИ:
1. Отвечай дружелюбно и профессионально
2. Используй эмодзи для лучшего восприятия
3. Объясняй сложные вещи простым языком
4. Всегда подчеркивай преимущества BnAuto
5. При необходимости переводи на казахский язык
6. Если не знаешь ответ - честно скажи и предложи связаться с поддержкой

ЧАСТЫЕ ВОПРОСЫ:
- "Как работает выкуп?" → Объясни что после всех платежей авто становится собственностью за 1₸
- "Сколько стоит?" → Цены зависят от автомобиля, покажи примеры
- "Какие документы?" → Паспорт, водительские права, подтверждение дохода
- "Безопасно ли?" → Расскажи про проверки, страхование, договоры

Отвечай на русском языке, если пользователь не просит казахский.`,
        messages,
        temperature: 0.7,
        maxTokens: 500,
      })

      return result.toAIStreamResponse()
    } catch (aiError) {
      console.error("AI SDK error:", aiError)

      // Fallback ответы без AI
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""

      let response = "Извините, AI временно недоступен. "

      if (lastMessage.includes("выкуп") || lastMessage.includes("1")) {
        response += "Но могу сказать: после оплаты всех арендных платежей автомобиль становится вашим за 1₸! 🚗"
      } else if (lastMessage.includes("документ")) {
        response += "Для аренды нужны: паспорт, водительские права и подтверждение дохода. 📄"
      } else if (lastMessage.includes("город")) {
        response += "Мы работаем в Алматы, Астане и Шымкенте! 🏙️"
      } else if (lastMessage.includes("оплат")) {
        response += "Оплата через Kaspi Pay: ежедневно, еженедельно или ежемесячно. 💳"
      } else {
        response += "Свяжитесь с нашей поддержкой для получения подробной информации! 📞"
      }

      return new Response(response, {
        headers: { "Content-Type": "text/plain" },
      })
    }
  } catch (error) {
    console.error("API error:", error)
    return new Response(JSON.stringify({ error: "Внутренняя ошибка сервера" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
