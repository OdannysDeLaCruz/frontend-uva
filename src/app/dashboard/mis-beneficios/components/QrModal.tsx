import { QRCodeCanvas } from 'qrcode.react'
import { QrBenefit } from '@/app/core/types/benefit'

function QrModal({
  qr,
  onClose,
}: {
  qr: QrBenefit;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">
          {qr.status === "PENDING"
            ? "Beneficio activo"
            : qr.status === "EXPIRED"
              ? "Beneficio vencido"
              : "Beneficio usado"}
        </h2>

        <div className="flex justify-center mb-4">
          <QRCodeCanvas value={qr.qr} size={260} />
        </div>

<div className="flex flex-col items-center mb-4">
                      <span className="text-sm text-gray-500 tracking-wide">
                        Código
                      </span>

                      <span className="text-3xl font-bold text-gray-900 tracking-widest mt-1">
                        {qr.code}
                      </span>
                    </div>
      </div>
    </div>
  );
}
export default QrModal