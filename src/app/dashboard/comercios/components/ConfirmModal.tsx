import Modal from './BenefitValidationBaseModal'

interface ConfirmModalData {
  benefitName: string
}

interface ConfirmModalProps {
  data: ConfirmModalData | null
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmModal({ data, onConfirm, onCancel }: ConfirmModalProps) {
  if (!data) return null

  return (
    <Modal onClose={onCancel}>
      <h2 className="text-xl font-bold mb-4">Confirmar redención</h2>

      <p className="mb-4">
        ¿Deseas redimir el beneficio{' '}
        <strong>{data.benefitName}</strong>?
      </p>

      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 border rounded py-2"
        >
          Cancelar
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 bg-emerald-600 text-white rounded py-2"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmModal
