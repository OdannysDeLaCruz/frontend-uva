import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import RegisterForm from "./components/register-form"

export default async function Register() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (token) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-purple-600/50"></div>
      <div className="relative z-10 p-4">
        <RegisterForm mode={"manual"} referrerCode="" />
      </div>
    </div>
  )
}
