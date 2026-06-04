import React, { useEffect } from 'react';
import { BoldCheckout } from '@/app/core/types/bold';
import { useBoldPayment } from '@/app/core/hooks/useBoldPayment';

const ContributionsTab: React.FC = () => {
  const {
    status,
    error,
    membershipInfo,
    loadMembershipInfo,
    createTransaction
  } = useBoldPayment();

  /**
   * Cuando el usuario hace clic en "Pagar":
   * 1. Crea la transacción en el backend (obtiene firma, orderId, apiKey)
   * 2. Inicializa el widget Bold con los datos retornados
   * 3. Abre el checkout Bold
   */
  const onPayClick = async () => {
    const redirectionUrl = process.env.NODE_ENV === 'development'
      ? undefined
      : `${process.env.NEXT_PUBLIC_HOST}/dashboard/membership/payment/callback`;

    const transactionData = await createTransaction({
      membershipId: membershipInfo?.membershipId,
      redirectUrl: redirectionUrl
    });

    if (!transactionData) return;

    if (!window.BoldCheckout) {
      console.error('Bold checkout script not loaded');
      return;
    }

    const checkout: BoldCheckout = new window.BoldCheckout({
      orderId: transactionData.orderId,
      currency: transactionData.currency,
      amount: transactionData.amount,
      apiKey: transactionData.apiKey,
      integritySignature: transactionData.integritySignature,
      description: transactionData.description,
      tax: transactionData.tax,
      ...(transactionData.redirectionUrl ? { redirectionUrl: transactionData.redirectionUrl } : {}),
    });

    checkout.open();

    // Bold no tiene callback onFinished en la integración personalizada.
    // El estado final llega por:
    //   a) Webhook de Bold → procesado async en backend
    //   b) Redirect a /payment/callback con bold-order-id como query param
    // Para polling iniciado desde el widget (sin redirect), usamos pollStatus
    // después de que el usuario regresa a la página.
    // Si se usa redirectionUrl, el callback page maneja el resultado.
  };

  useEffect(() => {
    loadMembershipInfo(1);
  }, [loadMembershipInfo]);

  useEffect(() => {
    if (status === 'success') {
      loadMembershipInfo(1);
    }
  }, [status, loadMembershipInfo]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);

  const getRegularity = (days: number) => {
    if (days <= 7) return 'Semanal';
    if (days <= 31) return 'Mensual';
    if (days <= 366) return 'Anual';
    return `Cada ${days} días`;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-CO', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

  const getButtonLabel = () => {
    if (status === 'loading') return 'Cargando...';
    if (status === 'creating') return 'Procesando...';
    if (status === 'polling') return 'Verificando...';
    if (!membershipInfo?.subscription) return 'Activar';
    if (membershipInfo.isWithinGracePeriod) return 'Renovar';
    return 'Reactivar';
  };

  const isActive = membershipInfo?.hasActiveSubscription && !membershipInfo?.isWithinGracePeriod;

  const total = membershipInfo ? membershipInfo.price + membershipInfo.taxAmount : null;

  return (
    <div className="space-y-6">
      <div className="max-w-xs">
        <div className="rounded-3xl bg-[#24003f] border border-white/[0.06] overflow-hidden">

          {/* ── ESTADO ACTIVO ── */}
          {isActive && membershipInfo?.subscription ? (
            <>
              <div className="px-6 pt-7 pb-5 text-center relative">
                <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1 tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Activa
                </span>

                <p className="text-xs tracking-widest text-gray-500 uppercase font-medium mb-2">
                  Membresía
                </p>
                <p className="text-3xl font-bold text-white leading-tight">
                  {membershipInfo.membershipName}
                </p>
              </div>

              <div className="mx-6 border-t border-white/[0.05]" />

              <div className="px-6 py-4 space-y-3 pb-6">
                <div className="flex justify-between items-center">
                  <span className="text-md text-gray-400">Frecuencia</span>
                  <span className="text-md text-gray-200">{getRegularity(membershipInfo.durationDays)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-md text-gray-400">Inicio</span>
                  <span className="text-md text-gray-200">{formatDate(membershipInfo.subscription.startDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-md text-gray-400">Vencimiento</span>
                  <span className="text-md text-emerald-400 font-semibold">{formatDate(membershipInfo.subscription.endDate)}</span>
                </div>
              </div>
            </>

          ) : (
            /* ── REQUIERE PAGO (sin suscripción, vencida o expirada) ── */
            <>
              <div className="px-6 pt-7 pb-5 text-center relative">
                {membershipInfo?.isWithinGracePeriod && (
                  <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-1 tracking-wide uppercase">
                    Vencida
                  </span>
                )}
                {membershipInfo?.isExpired && !membershipInfo?.isWithinGracePeriod && membershipInfo.subscription && (
                  <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 text-[10px] font-semibold text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-2.5 py-1 tracking-wide uppercase">
                    Expirada
                  </span>
                )}

                <p className="text-xs tracking-widest text-gray-500 uppercase font-medium mb-1">
                  Aporte en COP
                </p>
                <p className="text-gray-400 text-base mb-3">
                  {status === 'loading' ? '...' : membershipInfo?.membershipName ?? 'Membresía'}
                </p>
                <p className="text-[2.75rem] font-bold text-white leading-none tracking-tight tabular-nums">
                  {total !== null ? formatPrice(total) : <span className="text-gray-600">$ —</span>}
                </p>
                <p className="text-md text-gray-400 mt-1.5">
                  {membershipInfo ? `incluye IVA ${formatPrice(membershipInfo.taxAmount)}` : 'cargando...'}
                </p>
              </div>

              <div className="mx-6 border-t border-white/[0.05]" />

              <div className="px-6 py-4 space-y-3">
                {membershipInfo ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-md text-gray-400">Aporte base</span>
                      <span className="text-md text-gray-300 tabular-nums">{formatPrice(membershipInfo.price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-md text-gray-400">IVA 19%</span>
                      <span className="text-md text-gray-300 tabular-nums">{formatPrice(membershipInfo.taxAmount)}</span>
                    </div>
                    {membershipInfo.durationDays && (
                      <div className="flex justify-between items-center">
                        <span className="text-md text-gray-400">Frecuencia</span>
                        <span className="text-md text-gray-300">{getRegularity(membershipInfo.durationDays)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-2 text-center">
                    <span className="text-md text-gray-600">Sin datos disponibles</span>
                  </div>
                )}
              </div>

              {membershipInfo?.isWithinGracePeriod && membershipInfo.subscription && (
                <div className="mx-6 mb-4 flex items-center gap-2 rounded-xl bg-amber-400/8 border border-amber-400/15 px-3 py-2.5">
                  <span className="text-amber-400">⚠</span>
                  <p className="text-amber-300/90 text-sm leading-snug">
                    Venció el <span className="font-semibold">{formatDate(membershipInfo.subscription.endDate)}</span>
                  </p>
                </div>
              )}
              {membershipInfo?.isExpired && !membershipInfo?.isWithinGracePeriod && membershipInfo.subscription && (
                <div className="mx-6 mb-4 flex items-center gap-2 rounded-xl bg-red-400/8 border border-red-400/15 px-3 py-2.5">
                  <span className="text-red-400">✕</span>
                  <p className="text-red-300/90 text-sm leading-snug">
                    Expirada desde <span className="font-semibold">{formatDate(membershipInfo.subscription.endDate)}</span>
                  </p>
                </div>
              )}

              <div className="px-6 pb-6">
                <button
                  onClick={onPayClick}
                  disabled={status === 'loading' || status === 'creating' || !membershipInfo}
                  className="w-full py-3.5 rounded-2xl text-base font-semibold text-white
                    bg-green-600 hover:bg-green-500 cursor-pointer
                    disabled:bg-[#2D2748] disabled:text-gray-500 disabled:cursor-not-allowed
                    transition-colors duration-150 active:scale-[0.985]"
                >
                  {getButtonLabel()}
                </button>
                {error && <p className="text-red-400 text-xs text-center mt-2.5">{error}</p>}
                {status === 'success' && <p className="text-emerald-400 text-xs text-center mt-2.5 font-medium">¡Pago registrado!</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionsTab;
