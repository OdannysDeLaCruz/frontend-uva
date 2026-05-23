import { QrBenefit } from "@/app/core/types/benefit";
import Image from "next/image";

function QrHistoryItem({ qr }: { qr: QrBenefit }) {
  const isUsed = qr.status === "USED";

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-b-0">
      {/* Business image */}
      <Image
        src={qr.partnerBusiness.photo}
        alt={qr.partnerBusiness.name}
        width={44}
        height={44}
        className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {qr.partnerBusiness.name}
        </p>
        <p className="text-sm text-gray-600 truncate">
          {qr.benefit.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {isUsed
            ? `Usado el ${new Date(qr.updatedAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}`
            : `Venció el ${new Date(qr.expiresAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}`}
        </p>
      </div>

      {/* Status badge */}
      <span
        className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
          isUsed
            ? "bg-blue-50 text-blue-700"
            : "bg-red-50 text-red-600"
        }`}
      >
        {isUsed ? "Usado" : "Vencido"}
      </span>
    </div>
  );
}

export default QrHistoryItem;
