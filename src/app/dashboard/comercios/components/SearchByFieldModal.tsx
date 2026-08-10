import React, { useState } from 'react'
import Modal from './BenefitValidationBaseModal'
import { SearchableBenefitField } from '@/app/core/types/benefit'

interface SearchByFieldModalSubmitPayload {
  benefitId: number
  value: string
}

interface SearchByFieldModalProps {
  fields: SearchableBenefitField[]
  onSubmit: (payload: SearchByFieldModalSubmitPayload) => void
  onClose: () => void
}

function SearchByFieldModal({
  fields,
  onSubmit,
  onClose,
}: SearchByFieldModalProps) {
  const [benefitId, setBenefitId] = useState<number>(
    fields[0]?.benefitId ?? 0
  )
  const [value, setValue] = useState('')

  const selectedField =
    fields.find(f => f.benefitId === benefitId) ?? fields[0]

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">
        Buscar por {selectedField?.customFieldLabel ?? 'campo'}
      </h2>

      {fields.length > 1 && (
        <select
          className="w-full border p-2 rounded mb-3 bg-white text-gray-900"
          value={benefitId}
          onChange={e => setBenefitId(Number(e.target.value))}
        >
          {fields.map(f => (
            <option key={f.benefitId} value={f.benefitId}>
              {f.benefitName} ({f.customFieldLabel})
            </option>
          ))}
        </select>
      )}

      <input
        className="w-full border p-2 rounded mb-4 bg-white text-gray-900 placeholder-gray-400"
        placeholder={selectedField?.customFieldLabel ?? 'Valor'}
        value={value}
        onChange={e => setValue(e.target.value)}
      />

      <button
        onClick={() => onSubmit({ benefitId, value })}
        className="w-full bg-emerald-600 text-white py-2 rounded"
      >
        Buscar
      </button>
    </Modal>
  )
}

export default SearchByFieldModal
