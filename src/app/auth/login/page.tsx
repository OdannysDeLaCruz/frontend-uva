import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import LoginForm from "./components/login-form"

export default async function Login() {
  // Verificar si el usuario ya está autenticado
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (token) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
}
