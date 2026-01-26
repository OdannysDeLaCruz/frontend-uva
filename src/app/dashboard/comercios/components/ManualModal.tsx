import React, { useState } from 'react'
import Modal from './BenefitValidationBaseModal'

interface ManualModalSubmitPayload {
  code: string
  document: string
}

interface ManualModalProps {
  onSubmit: (payload: ManualModalSubmitPayload) => void
  onClose: () => void
}

function ManualModal({ onSubmit, onClose }: ManualModalProps) {
  const [code, setCode] = useState('')
  const [document, setDocument] = useState('')

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Verificar beneficio</h2>

      <input
        maxLength={6}
        className="w-full border p-2 rounded mb-3 bg-white text-gray-900 placeholder-gray-400"
        placeholder="Código del beneficio"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded mb-4 bg-white text-gray-900 placeholder-gray-400"
        placeholder="Número de documento"
        value={document}
        onChange={(e) => setDocument(e.target.value)}
      />

      <button
        onClick={() => onSubmit({ code, document })}
        className="w-full bg-emerald-600 text-white py-2 rounded"
      >
        Verificar
      </button>
    </Modal>
  )
}

export default ManualModal
