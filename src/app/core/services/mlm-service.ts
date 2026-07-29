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

export interface DirectoPrimario extends DirectoUser {
  isPersonal: boolean
}

export interface DirectosResponse {
  primarios: DirectoPrimario[]
  secundarios: DirectoUser[]
  totalPersonales: number
}

export async function getDirectos(): Promise<DirectosResponse> {
  const response = await apiClient.get("/v1/mlm/directos")
  return response.data
}
