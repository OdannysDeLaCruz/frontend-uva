import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import ComercioRegisterForm from "./components/comercio-register-form"

export default async function RegisterComercio() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (token) {
    redirect("/dashboard/comercios")
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>
      <div className="relative z-10 p-4">
        <ComercioRegisterForm />
      </div>
    </div>
  )
}
