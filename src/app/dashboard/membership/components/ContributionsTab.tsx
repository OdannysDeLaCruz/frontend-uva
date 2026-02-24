import React, { useEffect } from 'react';
import { WompiTransaction, WompiWidget } from '@/app/core/types/wompi';
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
   * 1. Crea la transacción en el backend
   * 2. Abre el widget de Wompi con los datos retornados
   */
  const onPayClick = async () => {
    // 1. Crear transacción
    const transactionData = await createTransaction({
      membershipId: membershipInfo?.membershipId,
      redirectUrl: process.env.NEXT_PUBLIC_WOMPI_REDIRECT_URL || ''
    });

    if (!transactionData) {
      console.error('Failed to create transaction');
      return;
    }

    // 2. Abrir widget con los datos de la transacción
    const checkout: WompiWidget | null = window.WidgetCheckout ? (new window.WidgetCheckout({
      currency: transactionData.currency,
      amountInCents: transactionData.amountInCents,
      taxInCents: {
        vat: transactionData.taxAmountInCents,
        consumption: 0,
      },
      reference: transactionData.reference,
      publicKey: transactionData.publicKey,
      signature: {
        integrity: transactionData.integritySignature,
      },
      redirectUrl: transactionData.redirectUrl,
      onFinished: (transaction: WompiTransaction) => {
        console.log('Transaction finished', transaction);
        if (transaction.status === 'APPROVED') {
          pollStatus(transactionData.transactionId);
        } else {
          console.error(
            `Transaction ${transaction.status}: ${transaction.statusMessage || 'Unknown error'}`
          );
        }
      },
    })) : null;

    if (checkout) {
      checkout.open(function (result: { transaction: { id: string } }) {
        console.log("Transaction ID: ", result.transaction.id);
      });
    }
  };

  // Cargar info de membresía al montar (sin crear transacción)
  useEffect(() => {
    loadMembershipInfo(1);
  }, [loadMembershipInfo]);

  // Recargar info de membresía tras pago exitoso
  useEffect(() => {
    if (status === 'success') {
      loadMembershipInfo(1);
    }
  }, [status, loadMembershipInfo]);

  // Formatear precio para mostrar
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

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
        {/* Sección de Activación */}
        <div className='col-span-1'>
          <div className='flex flex-col'>
            <p className='text-center text-2xl text-sky-400 font-semibold mb-2'>Aporte en COP</p>

            <div className='flex flex-col justify-center border-2 border-sky-400 p-3'>
              <p className='text-center text-xl'>
                {membershipInfo?.membershipName || 'Membresía'}
              </p>

              {/* Card activa — sin botón de pago */}
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

              {/* Panel de pago — solo cuando no activa o en grace period */}
              {showPaymentPanel && (
                <>
                  {/* Banner período de gracia */}
                  {membershipInfo?.isWithinGracePeriod && membershipInfo.subscription && (
                    <div className='mt-3 bg-yellow-900/40 border border-yellow-500 rounded px-3 py-2 text-yellow-300 text-sm text-center'>
                      ⚠ Tu membresía venció el {formatDate(membershipInfo.subscription.endDate)}
                    </div>
                  )}

                  {/* Banner expirada (fuera de grace period) */}
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
