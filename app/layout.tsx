import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "BN Lease - Долгосрочная аренда автомобилей в Казахстане",
  description:
    "Лизинг корейских и китайских автомобилей с правом выкупа. Минимальный взнос от 15%. Быстрое оформление за 24 часа.",
  keywords: "лизинг автомобилей, аренда авто, Казахстан, корейские автомобили, китайские автомобили, BN Lease",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
