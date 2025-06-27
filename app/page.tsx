import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, CreditCard, CheckCircle, Shield, Award, Globe } from "lucide-react"
import Link from "next/link"
import { AIChatSupport } from "@/components/ai-chat-support"
import { AuthHeader } from "@/components/auth-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BnAuto
            </span>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">2025</Badge>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Каталог
            </Link>
            {/* Ссылка на калькулятор удалена */}
            <Link href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Как работает
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">
              О нас
            </Link>
          </nav>

          <AuthHeader />
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">Инновационная модель</Badge>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Как работает аренда с выкупом
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Революционная система, которая делает владение автомобилем доступным каждому
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-2xl transform hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Car className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl text-blue-800">1. Выберите автомобиль</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 text-center font-medium mb-4">
                  Найдите идеальный автомобиль в нашем каталоге с опцией "Аренда с выкупом"
                </p>
                <div className="bg-blue-200 p-3 rounded-lg">
                  <div className="text-sm text-blue-800 font-medium">✓ 15,000+ автомобилей</div>
                  <div className="text-sm text-blue-800 font-medium">✓ Все марки и модели</div>
                  <div className="text-sm text-blue-800 font-medium">✓ Проверенные владельцы</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:shadow-2xl transform hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <CreditCard className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl text-purple-800">2. Гибкие платежи</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700 text-center font-medium mb-4">
                  Оплачивайте аренду по удобному графику без процентов и переплат
                </p>
                <div className="bg-purple-200 p-3 rounded-lg">
                  <div className="text-sm text-purple-800 font-medium">✓ 0% годовых</div>
                  <div className="text-sm text-purple-800 font-medium">✓ Гибкий график</div>
                  <div className="text-sm text-purple-800 font-medium">✓ Kaspi Pay интеграция</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:shadow-2xl transform hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl text-green-800">3. Станьте владельцем</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 text-center font-medium mb-4">
                  После оплаты всех арендных платежей автомобиль становится вашим за 1₸
                </p>
                <div className="bg-green-200 p-3 rounded-lg">
                  <div className="text-sm text-green-800 font-medium">✓ Выкуп за 1₸</div>
                  <div className="text-sm text-green-800 font-medium">✓ Полное право собственности</div>
                  <div className="text-sm text-green-800 font-medium">✓ Переоформление документов</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Demo - блок с кнопкой на калькулятор удален */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Прозрачные условия для каждого</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Узнайте подробности об аренде с выкупом и выберите свой автомобиль уже сегодня!
            </p>
            <Link href="/catalog">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl">
                <Car className="w-5 h-5 mr-2" />
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* AI Chat Support */}
      <AIChatSupport />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BnAuto</span>
                <Badge className="bg-green-500">2025</Badge>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Инновационная платформа аренды автомобилей с правом выкупа. Делаем владение автомобилем доступным
                каждому.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Безопасно</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-400">Надежно</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">По всему Казахстану</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Платформа</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/catalog" className="hover:text-white transition-colors">
                    Каталог автомобилей
                  </Link>
                </li>
                {/* Ссылка на калькулятор удалена */}
                <li>
                  <Link href="#how-it-works" className="hover:text-white transition-colors">
                    Как работает
                  </Link>
                </li>
                <li>
                  <Link href="/add-car" className="hover:text-white transition-colors">
                    Добавить авто
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Центр помощи
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    AI Чат-бот
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Безопасность
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Карьера
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Пресс-центр
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Партнеры
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
             <p className="text-gray-400 text-sm">
  &copy; 2025 BnAuto. Барлық құқықтар қорғалған.
  <br />
  <span className="text-indigo-400">Сделано с любовью в Казахстане 🇰🇿</span>
</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Политика конфиденциальности
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Условия использования
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
