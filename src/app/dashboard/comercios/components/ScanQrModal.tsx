'use client'

import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useRef, useCallback } from 'react'

interface ScanQrModalProps {
  onScan: (decoded: string) => void
  onClose: () => void
}

export default function ScanQrModal({
  onScan,
  onClose,
}: ScanQrModalProps) {
  const qrRef = useRef<Html5Qrcode | null>(null)
  const mountedRef = useRef(false)

  const stop = useCallback(() => {
    qrRef.current
      ?.stop()
      .then(() => qrRef.current?.clear())
      .catch(() => {})
      .finally(() => {
        qrRef.current = null
      })
  }, [])

  const start = useCallback(async () => {
    try {
      await Html5Qrcode.getCameras()
    } catch {
      console.error('No cameras found or permission denied')
      return
    }

    if (!mountedRef.current) return

    const container = document.getElementById('qr-reader')
    if (!container) return

    stop()

    const qr = new Html5Qrcode('qr-reader')
    qrRef.current = qr

    try {
      const cameras = await Html5Qrcode.getCameras()
      const backCamera =
        cameras.find((c) => c.label.toLowerCase().includes('back')) ??
        cameras[0]

      await qr.start(
        { deviceId: { exact: backCamera.id } },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          onScan(decodedText)
          stop()
          onClose()
        },
           () => {
           }
         )
    } catch (err) {
      console.error('Start camera failed:', err)
    }
  }, [onScan, onClose, stop])

  useEffect(() => {
    mountedRef.current = true

    const raf = requestAnimationFrame(() => {
      setTimeout(start, 150)
    })

    return () => {
      mountedRef.current = false
      cancelAnimationFrame(raf)
      stop()
    }
  }, [start, stop])

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Escanear QR</h2>

        <div
          id="qr-reader"
          className="w-full h-[260px] rounded-lg overflow-hidden bg-black"
        />

        <p className="text-sm text-gray-500 mt-4 text-center">
          Apunta la cámara al código QR
        </p>
      </div>
    </div>
  )
}
