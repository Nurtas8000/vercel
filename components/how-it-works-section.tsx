import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Calculator, Car, Key } from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "Подайте заявку",
    description: "Заполните онлайн-заявку или обратитесь в наш офис",
  },
  {
    icon: Calculator,
    title: "Получите расчет",
    description: "Мы рассчитаем индивидуальные условия лизинга",
  },
  {
    icon: Car,
    title: "Выберите автомобиль",
    description: "Подберите подходящую модель из нашего каталога",
  },
  {
    icon: Key,
    title: "Получите ключи",
    description: "Оформите документы и получите свой автомобиль",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Как получить автомобиль?</h2>
          <p className="text-xl text-gray-600">Простой процесс в 4 шага</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="border-0 shadow-md text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
            Подать заявку сейчас
          </Button>
        </div>
      </div>
    </section>
  )
}
