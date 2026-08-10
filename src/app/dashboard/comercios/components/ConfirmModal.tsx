import Modal from './BenefitValidationBaseModal'

interface ConfirmModalCustomField {
  label: string
  value: string
}

interface ConfirmModalData {
  userName: string
  benefitName: string
  customFields?: ConfirmModalCustomField[]
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
      <h2 className="text-xl font-bold mb-4">Resumen del beneficio</h2>

      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Miembro
          </p>
          <p className="text-gray-900 font-medium">{data.userName}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Beneficio
          </p>
          <p className="text-gray-900 font-medium">{data.benefitName}</p>
        </div>

        {data.customFields && data.customFields.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Datos adicionales
            </p>
            <ul className="space-y-1">
              {data.customFields.map((field, idx) => (
                <li
                  key={idx}
                  className="text-sm flex justify-between border-b border-gray-100 pb-1"
                >
                  <span className="text-gray-500">{field.label}</span>
                  <span className="font-medium text-gray-900">
                    {field.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Verifica los datos antes de aplicar el beneficio.
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
