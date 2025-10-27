import apiClient from "./api-client"

export interface User {
  id: number
  name: string
  lastname: string
  email: string
  phone: string
  referralCode: string
  isActive: boolean
}

export interface DirectoUser extends User {
  createdAt: string
}

export interface DirectosResponse {
  usuario: User
  primarios: DirectoUser[]
  secundarios: DirectoUser[]
  totalDirectos: number
  totalPrimarios: number
  totalSecundarios: number
}

export async function getDirectos(): Promise<DirectosResponse> {
  const response = await apiClient.get("/v1/mlm/directos")
  return response.data
}
