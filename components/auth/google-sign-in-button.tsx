"use client"

import { useState } from "react"

import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react" // Пример иконки

export function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    const { error: signInError } = await signInWithGoogle()
    if (signInError) {
      setError(signInError.message)
      console.error("Google Sign-In Error:", signInError)
    }
    // Supabase редиректит на Google, затем обратно.
    // Если ошибка не произошла на этом этапе, то setLoading(false) может не выполниться,
    // так как произойдет редирект.
    // Если signInWithOAuth возвращает ошибку сразу (например, провайдер не настроен),
    // то isLoading нужно сбросить.
    if (signInError) {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Button variant="outline" className="w-full" onClick={handleSignIn} disabled={isLoading}>
        {isLoading ? (
          "Перенаправление..."
        ) : (
          <>
            <Chrome className="mr-2 h-4 w-4" />
            Войти с помощью Google
          </>
        )}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
