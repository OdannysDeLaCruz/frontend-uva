'use client';

import React, { useRef } from 'react';
import {
  Camera,
  IdCard,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import type { KycDocumentType, KycStatus } from '@/app/core/types/kyc';
import type { KycDocProgress, KycFileSelection } from '@/app/core/hooks/useKyc';

interface DocumentUploadZoneProps {
  documentType: KycDocumentType;
  label: string;
  description: string;
  selection: KycFileSelection;
  progress: KycDocProgress;
  existingStatus?: KycStatus;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

const DOCUMENT_ICONS: Record<KycDocumentType, React.ReactNode> = {
  NATIONAL_IDENTITY_CARD_FRONT: <IdCard size={32} className="text-purple-400" />,
  NATIONAL_IDENTITY_CARD_BACK: <IdCard size={32} className="text-purple-400" />,
  NATIONAL_IDENTITY_CARD_SELFIE: <Camera size={32} className="text-purple-400" />
};

const PROGRESS_OVERLAY: Record<KycDocProgress, React.ReactNode | null> = {
  idle: null,
  uploading: (
    <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center gap-2 z-10">
      <Loader2 size={28} className="text-purple-400 animate-spin" />
      <span className="text-xs text-gray-300">Subiendo...</span>
    </div>
  ),
  done: (
    <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center gap-2 z-10">
      <CheckCircle2 size={28} className="text-emerald-400" />
      <span className="text-xs text-emerald-300">Listo</span>
    </div>
  ),
  error: (
    <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center gap-2 z-10">
      <AlertCircle size={28} className="text-red-400" />
      <span className="text-xs text-red-300">Error al subir</span>
    </div>
  )
};

const STATUS_LOCKED: Partial<Record<KycStatus, { label: string; color: string }>> = {
  APPROVED: { label: 'Aprobado — no modificable', color: 'text-emerald-400' },
  IN_REVIEW: { label: 'En revisión — no modificable', color: 'text-blue-400' }
};

export default function DocumentUploadZone({
  documentType,
  label,
  description,
  selection,
  progress,
  existingStatus,
  onFileChange,
  disabled = false
}: DocumentUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isLocked = !!(existingStatus && STATUS_LOCKED[existingStatus]);
  const isDisabled = disabled || isLocked || progress === 'uploading' || progress === 'done';
  const lockInfo = existingStatus ? STATUS_LOCKED[existingStatus] : undefined;

  const handleClick = () => {
    if (!isDisabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileChange(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {DOCUMENT_ICONS[documentType]}
          <div>
            <p className="text-sm font-semibold text-gray-100">{label}</p>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </div>
        {isLocked && lockInfo && (
          <span className={`text-[10px] font-semibold uppercase tracking-wide ${lockInfo.color}`}>
            {lockInfo.label}
          </span>
        )}
      </div>

      <div
        onClick={handleClick}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
          ${isDisabled
            ? 'border-gray-700 cursor-not-allowed opacity-60'
            : 'border-purple-500/50 cursor-pointer hover:border-purple-400 hover:bg-white/[0.02]'
          }
          ${selection.preview ? 'aspect-video' : 'h-36'}
        `}
      >
        {PROGRESS_OVERLAY[progress]}

        {selection.preview ? (
          <img
            src={selection.preview}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Upload size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-300">
                {isLocked ? 'Documento bloqueado' : 'Haz clic para seleccionar'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">JPEG, PNG o WebP · Máx. 5MB</p>
            </div>
          </div>
        )}
      </div>

      {selection.preview && progress !== 'done' && !isLocked && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 truncate max-w-[70%]">
            {selection.file?.name}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isDisabled}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-40"
            >
              <RefreshCw size={12} />
              Cambiar
            </button>
            <button
              type="button"
              onClick={() => onFileChange(null)}
              disabled={isDisabled}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors disabled:opacity-40"
            >
              <X size={12} />
              Quitar
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
        disabled={isDisabled}
      />
    </div>
  );
}
