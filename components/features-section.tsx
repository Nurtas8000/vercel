import { Card, CardContent } from "@/components/ui/card"
import { Shield, Calculator, Clock, Banknote, FileText, Headphones } from "lucide-react"

const features = [
  {
    icon: Banknote,
    title: "Минимальный взнос",
    description: "Первоначальный взнос от 15%. Получите автомобиль с минимальными вложениями.",
  },
  {
    icon: Calculator,
    title: "Гибкие условия",
    description: "Индивидуальный расчет платежей. Срок лизинга от 1 до 5 лет.",
  },
  {
    icon: Clock,
    title: "Быстрое оформление",
    description: "Одобрение заявки за 24 часа. Получите автомобиль в кратчайшие сроки.",
  },
  {
    icon: Shield,
    title: "Полное КАСКО",
    description: "Все автомобили застрахованы по КАСКО. Ваша безопасность - наш приоритет.",
  },
  {
    icon: FileText,
    title: "Право выкупа",
    description: "В конце срока выкупите автомобиль по остаточной стоимости.",
  },
  {
    icon: Headphones,
    title: "Поддержка 24/7",
    description: "Круглосуточная техническая поддержка и сервисное обслуживание.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">ДОЛГОСРОЧНАЯ АРЕНДА С ВЫКУПОМ</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Преимущества BN Lease</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы предлагаем лучшие условия долгосрочной аренды с правом выкупа в Казахстане.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
