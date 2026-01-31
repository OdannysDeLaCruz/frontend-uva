import Modal from './BenefitValidationBaseModal'

interface SuccessModalProps {
  onClose: () => void
}

function SuccessModal({ onClose }: SuccessModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="text-center space-y-4">
        <div className="text-5xl">🎉</div>

        <h2 className="text-xl font-bold">
          Beneficio redimido
        </h2>

        <p className="text-gray-600">
          El beneficio fue utilizado correctamente
        </p>

        <button
          onClick={onClose}
          className="w-full bg-emerald-600 text-white py-2 rounded"
        >
          Finalizar
        </button>
      </div>
    </Modal>
  )
}

export default SuccessModal
