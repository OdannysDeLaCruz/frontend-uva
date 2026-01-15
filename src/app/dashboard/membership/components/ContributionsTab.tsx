import React, { useEffect } from 'react';
// import { WompiTransaction, WompiWidget } from '@/app/core/types/wompi';
import { useWompiPayment } from '@/app/core/hooks/useWompiPayment';
import Image from 'next/image';

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

      <div className='grid grid-cols-3 gap-4'>
        {/* Sección de Activación */}
        <div className='col-span-1'>
          <div className='flex flex-col'>
            
            <div className='grid grid-cols-5 border-2 border-sky-400 mb-4'>
              <div className='col-span-2'>
                <Image src="/images/cop.png" alt="Producto" width={100} height={100} />
              </div>
              <div className='col-span-3'>
                <div className='flex flex-col p-2'>
                  <h2 className='text-center text-xl text-sky-400 m-0 leading-none'>Activación</h2>
                  <div className='border border-green-400 w-36 mx-auto mb-4'></div>
                  <p className='text-center text-[14px] font-bold text-white mb-4'>Activación Mensual Primera Vez Se Recibe</p>
                  <p className='text-center text-xs text-white'>
                    Vinculación al Programa de Fidelización <br />
                    Beneficios de Descuento Preferenciales <br />
                    y Otros Servicios de Aliados UVA. <br />
                    500gr de Cristal de Sábila
                  </p>
                  <div className='flex flex-col justify-start mx-auto w-36'>
                    <p className='text-right text-4xl mt-4 text-white leading-none'>$ 82.900</p>
                    <p className='text-right text-2xl text-white leading-none'>+IVA</p>
                  </div>
                </div>

              </div>
            </div>

            <p className='text-center text-2xl text-sky-400 font-semibold mb-2'>Aporte en COP</p>

            <div className='flex flex-col justify-center border-2 border-sky-400 p-3'>
              <p className='text-center text-xl'>Activación Mensual Primera Vez</p>
              <div className='flex flex-col justify-start mx-auto w-48'>
                <p className='text-right text-5xl mt-4 text-white leading-none'>$ 65.900</p>
                <p className='text-right text-3xl text-white leading-none'>+IVA</p>
              </div>
              <button className="px-6 mt-4 text-xl bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200 border border-sky-500 mx-auto">
                Pagar
              </button>
            </div>

          </div>
        </div>
        {/* Sección de Crypto */}
        <div className='col-span-2'>
          <p className='text-center text-2xl text-sky-400 font-semibold mb-2'>Aporte en Crypto</p>

        </div>
      </div>
      
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
