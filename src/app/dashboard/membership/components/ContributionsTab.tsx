import React, { useEffect } from 'react';
import { BoldCheckout } from '@/app/core/types/bold';
import { useWompiPayment } from '@/app/core/hooks/useWompiPayment';

const ContributionsTab: React.FC = () => {
  const {
    status,
    error,
    membershipInfo,
    loadMembershipInfo,
    createTransaction,
    pollStatus
  } = useWompiPayment();

  /**
   * Cuando el usuario hace clic en "Pagar":
   * 1. Crea la transacción en el backend (obtiene firma, orderId, apiKey)
   * 2. Inicializa el widget Bold con los datos retornados
   * 3. Abre el checkout Bold
   */
  const onPayClick = async () => {
    const host = process.env.NEXT_PUBLIC_HOST || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const transactionData = await createTransaction({
      membershipId: membershipInfo?.membershipId,
      redirectUrl: isLocal ? undefined : `${host}/dashboard/membership/payment/callback`
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
  const showPaymentPanel = !membershipInfo?.hasActiveSubscription || membershipInfo?.isWithinGracePeriod;

  return (
    <div className="space-y-6">
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-1'>
          <div className='flex flex-col'>
            <p className='text-center text-2xl text-sky-400 font-semibold mb-2'>Aporte en COP</p>

            <div className='flex flex-col justify-center border-2 border-sky-400 p-3'>
              <p className='text-center text-xl'>
                {membershipInfo?.membershipName || 'Membresía'}
              </p>

              {/* Suscripción activa — sin botón de pago */}
              {isActive && membershipInfo?.subscription && (
                <div className='mt-3 flex flex-col gap-1 text-center'>
                  <span className='text-green-400 font-semibold text-base'>● Activa</span>
                  <span className='text-gray-300 text-sm'>
                    {getRegularity(membershipInfo.durationDays)}
                  </span>
                  <span className='text-gray-400 text-sm'>
                    Vence el {formatDate(membershipInfo.subscription.endDate)}
                  </span>
                </div>
              )}

              {/* Panel de pago */}
              {showPaymentPanel && (
                <>
                  {membershipInfo?.isWithinGracePeriod && membershipInfo.subscription && (
                    <div className='mt-3 bg-yellow-900/40 border border-yellow-500 rounded px-3 py-2 text-yellow-300 text-sm text-center'>
                      ⚠ Tu membresía venció el {formatDate(membershipInfo.subscription.endDate)}
                    </div>
                  )}

                  {membershipInfo?.isExpired && !membershipInfo?.isWithinGracePeriod && membershipInfo?.subscription && (
                    <div className='mt-3 bg-red-900/40 border border-red-500 rounded px-3 py-2 text-red-300 text-sm text-center'>
                      Membresía expirada desde {formatDate(membershipInfo.subscription.endDate)}
                    </div>
                  )}

                  <div className='flex flex-col justify-start mx-auto w-48'>
                    <p className='text-right text-5xl mt-4 text-white leading-none'>
                      {membershipInfo ? formatPrice(membershipInfo.price) : '$ --'}
                    </p>
                    <p className='text-right text-xl text-sky-300 leading-none'>
                      +IVA {membershipInfo ? formatPrice(membershipInfo.taxAmount) : ''}
                    </p>
                    <p className='text-right text-2xl text-white font-semibold leading-none'>
                      Total: {membershipInfo ? formatPrice(membershipInfo.price + membershipInfo.taxAmount) : '$ --'}
                    </p>
                  </div>

                  <button
                    onClick={onPayClick}
                    disabled={status === 'loading' || status === 'creating' || !membershipInfo}
                    className="px-6 mt-4 text-xl bg-sky-600 hover:bg-sky-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 border border-sky-500 mx-auto"
                  >
                    {getButtonLabel()}
                  </button>

                  {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                  {status === 'success' && <p className="text-green-400 text-center mt-2">¡Pago exitoso!</p>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionsTab;
