export interface AuthCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  access_token: string;
}

export interface StandardResponse {
  ok: boolean;
  message: string;
}

export interface RegisterData {
  mode: 'automatic' | 'manual'
  referrerCode: string
  name: string
  lastname: string
  documentType: 'natural' | 'juridica'
  doc_number: string
  email: string
  phone: string
  password: string
}

export interface User {
  id: number
  name: string
  username: string
  lastname: string
  doc_number: string
  doc_type: string
  email: string
  phone: string
  referralCode: string
  raffleNumber: string
  isActive: boolean
  membershipId: number
  parentId: number
  image: string
}

export interface PublicUserDto {
  id: number;
  name: string;
  lastname: string;
  email: string;
  username: string;
  hasChildren: boolean;
  parentId?: number | null;
  isActive: boolean;
}
