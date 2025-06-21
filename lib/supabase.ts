import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Для серверных компонентов (Server Components)
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Отсутствуют переменные окружения для Supabase")
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

// Для клиентских компонентов (Client Components)
// Используем синглтон-паттерн для предотвращения множественных инстансов
let clientSingleton: ReturnType<typeof createBrowserClient> | null = null

export function createBrowserClient() {
  if (clientSingleton) return clientSingleton

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Отсутствуют публичные переменные окружения для Supabase")
  }

  clientSingleton = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return clientSingleton
}
