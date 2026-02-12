export interface AuthCredentials {
  username: string
  password: string
  type?: 'user' | 'partner'
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
  earlyAccess: boolean
  membershipId: number
  parentId: number
  image: string
  role: string
  type?: 'user' | 'partner'
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
  referralCode: string;
}

export interface RewardsCount {
  rewardsAvailable: number;
  accumulatedRewards: number;
  rewardsDelivered: number;
}
export interface ReferralMarketingCount {
  direct: number;
  structure: number;
  tanque: number;
}

export interface RegisterPartnerData {
  name: string
  representativeName: string
  legalName?: string
  docNumber: string
  address?: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}