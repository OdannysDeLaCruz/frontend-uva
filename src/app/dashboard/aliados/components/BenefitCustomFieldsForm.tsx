'use client'

import React from 'react'
import { BenefitCustomField } from '@/app/core/types/benefit'

interface BenefitCustomFieldsFormProps {
  fields: BenefitCustomField[]
  values: Record<number, string>
  onChange: (fieldId: number, value: string) => void
}

const INPUT_TYPE_MAP: Record<BenefitCustomField['fieldType'], string> = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
}

const BenefitCustomFieldsForm: React.FC<BenefitCustomFieldsFormProps> = ({
  fields,
  values,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.id} className="flex flex-col gap-1">
          <label htmlFor={`custom-field-${field.id}`} className="text-sm font-medium text-gray-700">
            {field.label}
            {field.isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            id={`custom-field-${field.id}`}
            type={INPUT_TYPE_MAP[field.fieldType]}
            placeholder={field.placeholder ?? undefined}
            value={values[field.id] ?? ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.isRequired}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      ))}
    </div>
  )
}

export default BenefitCustomFieldsForm
