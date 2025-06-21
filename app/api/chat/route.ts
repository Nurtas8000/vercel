import type { NextRequest } from "next/server"
import { groq } from "@ai-sdk/groq" // Импортируем Groq
import { streamText, type CoreMessage } from "ai"

// Fallback если нет AI SDK или ключа
export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json()

    // Проверяем наличие Groq API ключа
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY is not set. Chatbot will use fallback responses.")
      return new Response(
        JSON.stringify({
          error: "Groq API key не настроен. Добавьте GROQ_API_KEY в environment variables.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Пытаемся использовать AI SDK с Groq
    try {
      const result = await streamText({
        model: groq("llama3-8b-8192"), // Используем модель Llama 3 (8B) через Groq. Вы можете выбрать другую доступную модель.
        // model: openai("gpt-3.5-turbo"), // Это было для OpenAI
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

      // Convert the text stream into a proper NextResponse/Response
      return result.toDataStreamResponse()
    } catch (aiError) {
      console.error("Groq AI SDK error:", aiError)

      // Fallback ответы без AI (остаются такими же)
      const lastMessageContent = messages[messages.length - 1]?.content?.toString().toLowerCase() || ""
      let responseText = "Извините, AI временно недоступен. "

      if (lastMessageContent.includes("выкуп") || lastMessageContent.includes("1")) {
        responseText += "Но могу сказать: после оплаты всех арендных платежей автомобиль становится вашим за 1₸! 🚗"
      } else if (lastMessageContent.includes("документ")) {
        responseText += "Для аренды нужны: паспорт, водительские права и подтверждение дохода. 📄"
      } else if (lastMessageContent.includes("город")) {
        responseText += "Мы работаем в Алматы, Астане и Шымкенте! 🏙️"
      } else if (lastMessageContent.includes("оплат")) {
        responseText += "Оплата через Kaspi Pay: ежедневно, еженедельно или ежемесячно. 💳"
      } else {
        responseText += "Свяжитесь с нашей поддержкой для получения подробной информации! 📞"
      }
      return new Response(responseText, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
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
