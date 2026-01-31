import { QRCodeCanvas } from 'qrcode.react'
import { getTimeRemaining } from '@/app/dashboard/util/util'
import { QrBenefit } from '@/app/core/types/benefit'
import Image from 'next/image'


function QrCard({
  title,
  qrs,
  onSelect,
}: {
  title: string
  qrs: QrBenefit[]
  onSelect: (qr: QrBenefit) => void
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {title}
      </h2>

      {qrs.length === 0 ? (
        <p className="text-gray-600 text-sm">
          No hay beneficios
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qrs.map(qr => (
            <button
              key={qr.code}
              onClick={() => onSelect(qr)}
              className="w-full border rounded-xl p-4 hover:shadow-md transition text-left"
            >
              <div className="flex gap-4 items-center">
                {/* QR + Código */}
                <div className="flex flex-col items-center min-w-[140px]">
                  <QRCodeCanvas value={qr.qr} size={120} />
                  <span className="mt-2 text-sm text-gray-500">
                    Código
                  </span>
                  <span className="text-lg font-bold text-gray-900 tracking-widest">
                    {qr.code}
                  </span>
                </div>

                {/* Info comercio + beneficio */}
                <div className="flex flex-1 gap-4">
                  {/* Imagen comercio */}
                  <Image
                    src={qr.partnerBusiness.photo}
                    alt={qr.partnerBusiness.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  {/* Textos */}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {qr.partnerBusiness.name}
                    </span>

                    <span className="text-sm font-medium text-emerald-700">
                      {qr.benefit.name}
                    </span>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {qr.benefit.description}
                    </p>

                    {/* Estado */}
                    <div className="mt-2 text-xs">
                      {qr.status === 'USED' ? (
                        <span className="text-gray-500">
                          Usado el{' '}
                          <strong>
                            {new Date(qr.updatedAt!).toLocaleString()}
                          </strong>
                        </span>
                      ) : (
                        <span className="text-amber-600">
                          Expira en{' '}
                          <strong>
                            {getTimeRemaining(qr.expiresAt)}
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default QrCard
