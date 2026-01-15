import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import LoginForm from "./components/login-form"

export default async function Login() {
  // Verificar si el usuario ya está autenticado
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access_token")

  if (accessToken) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-purple-600/50"></div>
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
