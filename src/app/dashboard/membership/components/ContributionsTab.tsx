import React, { useEffect } from 'react';
// import { WompiTransaction, WompiWidget } from '@/app/core/types/wompi';
import { useWompiPayment } from '@/app/core/hooks/useWompiPayment';

const ContributionsTab: React.FC = () => {
  const { 
    // status,
    // error,
    // paymentData, 
    initPayment
  } = useWompiPayment();

  // const onPayClick = () => {
  //   const checkout: WompiWidget | null = window.WidgetCheckout ? (new window.WidgetCheckout({
  //     currency: paymentData?.currency,
  //     amountInCents: paymentData?.amountInCents,
  //     reference: paymentData?.reference,
  //     publicKey: paymentData?.publicKey,
  //     signature: {
  //       integrity: paymentData?.integritySignature,
  //     },
  //     redirectUrl: `${window.location.origin}/dashboard/membership/payment/callback`,
  //     taxInCents: { // Opcional
  //       vat: 1900,
  //       consumption: 0
  //     },
  //     customerData: { // Opcional
  //       email:'lola@gmail.com',
  //       fullName: 'Lola Flores',
  //       phoneNumber: '3040777777',
  //       phoneNumberPrefix: '+57',
  //       legalId: '123456789',
  //       legalIdType: 'CC'
  //     },
  //     onFinished: (transaction: WompiTransaction) => {
  //       console.log('Transaction', transaction)
  //       if (transaction.status === 'APPROVED') {
  //         console.log('transaction.status: APPROVED')
  //       } else {
  //         console.error(
  //           `Transaction ${transaction.status}: ${transaction.statusMessage || 'Unknown error'}`
  //         );
  //       }
  //     },
  //   })) : null;

  //   if (checkout) {
  //     checkout.open(function (result: { transaction: { id: string } }) {
  //       const transaction = result.transaction;
  //       console.log("Transaction ID: ", transaction.id);
  //       console.log("Transaction object: ", transaction);
  //     });
  //   }
  // }

  useEffect(() => {
    const initialize = async () => {
      const membershipId = 1;
      console.log('🔵 Iniciando pago...');
      await initPayment(membershipId);
    };

    initialize();
  }, []);

  return (
    <div className="space-y-6">
      {/* Contribution Info */}
      {/* <div className="glass p-6 rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Información de Aportes</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Aporte Mensual</p>
            <p className="text-2xl font-bold text-purple-400">$60.000 COP</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Próximo Pago</p>
            <p className="text-2xl font-bold text-purple-400">27 Nov 2025</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Estado</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
              Activa
            </span>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Total Aportado</p>
            <p className="text-2xl font-bold text-purple-400">$900.000 COP</p>
          </div>
        </div>
      </div> */}

      {/* Payment Button */}
      {/* <div className="flex justify-end">
        <button
          onClick={onPayClick}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Pagar
        </button>
      </div> */}
    </div>
  );
};

export default ContributionsTab;
