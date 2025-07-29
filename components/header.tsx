import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, Menu, Users, Building2, Phone } from "lucide-react"

export function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Car className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  BN Lease
                </span>
                <div className="text-xs text-blue-300 -mt-1">Ваш путь к автомобилю</div>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalog" className="text-blue-100 hover:text-white transition-colors font-medium">
              Каталог авто
            </Link>
            <Link href="/leasing" className="text-blue-100 hover:text-white transition-colors font-medium">
              Условия лизинга
            </Link>
            <Link href="/about" className="text-blue-100 hover:text-white transition-colors font-medium">
              О компании
            </Link>
            <Link href="/contacts" className="text-blue-100 hover:text-white transition-colors font-medium">
              Контакты
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white bg-transparent transition-all duration-300 font-semibold"
            >
              <Building2 className="w-5 h-5 mr-2" />
              Владельцам
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-300 font-semibold"
            >
              <Users className="w-5 h-5 mr-2" />
              Арендаторам
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-blue-100 hover:text-white hover:bg-blue-800 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-blue-100 hover:text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
