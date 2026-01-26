import { ReactNode } from 'react'

interface ModalProps {
  children: ReactNode
  onClose: () => void
}

const Modal = ({ children, onClose }: ModalProps) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white text-gray-900 rounded-xl w-full max-w-md p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
)

export default Modal
