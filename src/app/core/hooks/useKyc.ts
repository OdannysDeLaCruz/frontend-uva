'use client';

import { useState, useCallback } from 'react';
import { uploadKycDocument, getKycStatus } from '../services/kyc-service';
import {
  KYC_DOCUMENT_TYPES,
  type KycDocumentType,
  type KycVerification
} from '../types/kyc';

export type KycUploadStatus = 'idle' | 'loading' | 'success' | 'error';
export type KycDocProgress = 'idle' | 'uploading' | 'done' | 'error';

export interface KycFileSelection {
  file: File | null;
  preview: string | null;
}

export interface UseKycReturn {
  verifications: KycVerification[];
  statusLoading: boolean;
  statusError: string | null;
  fetchStatus: () => Promise<void>;

  selections: Record<KycDocumentType, KycFileSelection>;
  setFile: (type: KycDocumentType, file: File | null) => void;

  uploadStatus: KycUploadStatus;
  uploadError: string | null;
  uploadProgress: Record<KycDocumentType, KycDocProgress>;
  submitAll: () => Promise<void>;
  allSelected: boolean;

  reset: () => void;
}

const emptySelections = (): Record<KycDocumentType, KycFileSelection> =>
  Object.fromEntries(
    KYC_DOCUMENT_TYPES.map((t) => [t, { file: null, preview: null }])
  ) as Record<KycDocumentType, KycFileSelection>;

const emptyProgress = (): Record<KycDocumentType, KycDocProgress> =>
  Object.fromEntries(
    KYC_DOCUMENT_TYPES.map((t) => [t, 'idle' as KycDocProgress])
  ) as Record<KycDocumentType, KycDocProgress>;

export function useKyc(): UseKycReturn {
  const [verifications, setVerifications] = useState<KycVerification[]>([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const [selections, setSelections] =
    useState<Record<KycDocumentType, KycFileSelection>>(emptySelections);
  const [uploadStatus, setUploadStatus] = useState<KycUploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] =
    useState<Record<KycDocumentType, KycDocProgress>>(emptyProgress);

  const fetchStatus = useCallback(async () => {
    try {
      setStatusLoading(true);
      setStatusError(null);
      const data = await getKycStatus();
      setVerifications(data);
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : 'Error al obtener estado KYC'
      );
    } finally {
      setStatusLoading(false);
    }
  }, []);

  const setFile = useCallback(
    (type: KycDocumentType, file: File | null) => {
      setSelections((prev) => {
        if (prev[type].preview) URL.revokeObjectURL(prev[type].preview!);
        const preview = file ? URL.createObjectURL(file) : null;
        return { ...prev, [type]: { file, preview } };
      });
    },
    []
  );

  const allSelected = KYC_DOCUMENT_TYPES.every((t) => selections[t].file !== null);

  const submitAll = useCallback(async () => {
    if (!allSelected) return;

    setUploadStatus('loading');
    setUploadError(null);
    setUploadProgress(emptyProgress());

    try {
      for (const docType of KYC_DOCUMENT_TYPES) {
        const { file } = selections[docType];
        if (!file) continue;

        setUploadProgress((prev) => ({ ...prev, [docType]: 'uploading' }));
        try {
          await uploadKycDocument(docType, file);
          setUploadProgress((prev) => ({ ...prev, [docType]: 'done' }));
        } catch {
          setUploadProgress((prev) => ({ ...prev, [docType]: 'error' }));
          throw new Error(`Error al subir ${docType}`);
        }
      }

      setUploadStatus('success');
      await fetchStatus();
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Error al enviar documentos'
      );
      setUploadStatus('error');
    }
  }, [allSelected, selections, fetchStatus]);

  const reset = useCallback(() => {
    setSelections((prev) => {
      KYC_DOCUMENT_TYPES.forEach((t) => {
        if (prev[t].preview) URL.revokeObjectURL(prev[t].preview!);
      });
      return emptySelections();
    });
    setUploadStatus('idle');
    setUploadError(null);
    setUploadProgress(emptyProgress());
  }, []);

  return {
    verifications,
    statusLoading,
    statusError,
    fetchStatus,
    selections,
    setFile,
    uploadStatus,
    uploadError,
    uploadProgress,
    submitAll,
    allSelected,
    reset
  };
}
