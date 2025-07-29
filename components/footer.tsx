import Link from "next/link"
import { Car, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">BN Lease</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Ведущая лизинговая компания Казахстана.{" "}
              <span className="font-bold text-white">ДОЛГОСРОЧНАЯ АРЕНДА С ПРАВОМ ВЫКУПА</span> корейских и китайских
              автомобилей на выгодных условиях.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+7 (727) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@bnlease.kz</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>г. Алматы, ул. Абая 150/230</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Для владельцев</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/korean-cars" className="text-gray-400 hover:text-white transition-colors">
                  Корейские автомобили
                </Link>
              </li>
              <li>
                <Link href="/chinese-cars" className="text-gray-400 hover:text-white transition-colors">
                  Китайские автомобили
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-gray-400 hover:text-white transition-colors">
                  Калькулятор лизинга
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="text-gray-400 hover:text-white transition-colors">
                  Страхование
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="text-gray-400 hover:text-white transition-colors">
                  Условия лизинга
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-400 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Карьера
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 BN Lease. Все права защищены.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
