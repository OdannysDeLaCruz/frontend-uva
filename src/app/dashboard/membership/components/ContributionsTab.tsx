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

  // Formatear precio para mostrar
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

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
              <div className='flex flex-col justify-start mx-auto w-48'>
                <p className='text-right text-5xl mt-4 text-white leading-none'>
                  {membershipInfo ? formatPrice(membershipInfo.price) : '$ --'}
                </p>
                <p className='text-right text-3xl text-white leading-none'>+IVA</p>
              </div>

              <button
                onClick={onPayClick}
                disabled={status === 'loading' || status === 'creating' || !membershipInfo}
                className="px-6 mt-4 text-xl bg-sky-600 hover:bg-sky-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 border border-sky-500 mx-auto"
              >
                {status === 'loading' && 'Cargando...'}
                {status === 'creating' && 'Procesando...'}
                {status === 'polling' && 'Verificando...'}
                {(status === 'idle' || status === 'error' || status === 'success') && 'Pagar'}
              </button>

              {error && <p className="text-red-400 text-center mt-2">{error}</p>}
              {status === 'success' && <p className="text-green-400 text-center mt-2">¡Pago exitoso!</p>}

              {membershipInfo?.hasActiveSubscription && (
                <p className="text-yellow-400 text-center mt-2 text-sm">
                  Ya tienes una membresía activa
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionsTab;
