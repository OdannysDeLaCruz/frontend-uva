// import toast, {Toaster} from 'react-hot-toast';

export function getTimeRemaining(expiresAt: string | Date): string {
  const now = new Date()
  const expiration = new Date(expiresAt)
  const diffMs = expiration.getTime() - now.getTime()

  if (diffMs <= 0) return 'expirado'

  const minutes = Math.floor(diffMs / 1000 / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}min`
  }

  return `${minutes} minutos`
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  return true
};