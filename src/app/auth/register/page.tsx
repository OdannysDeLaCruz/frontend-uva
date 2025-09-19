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
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <RegisterForm mode={"manual"} referrerCode="" />
    </div>
  )
}
