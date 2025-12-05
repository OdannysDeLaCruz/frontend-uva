import React from 'react';
import { Copy, Link } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '@/app/core/contexts/auth-context';

const MembershipContributionsTab: React.FC = () => {
  const { user } = useAuth();

  const automaticLink = `${process.env.NEXT_PUBLIC_HOST}/auth/register/automatic/${user?.referralCode}`;
  const manualLink = `${process.env.NEXT_PUBLIC_HOST}/auth/register/manual/${user?.referralCode}`;

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message, {
      duration: 5000,
      position: "bottom-right",
    });
  };

  return (
    <div className="space-y-6">
     <div className='mt-10'>
      {/* MANUAL */}
      <div className='mb-6'>
        <p className='uppercase font-bold'>Enlace de registro manual</p>
        <div className="flex items-center space-x-4">
              <Link size={16} />
              <p className="text-sm text-blue-600">{manualLink}</p>
              <button onClick={() => copyToClipboard(manualLink, 'Enlace manual copiado al portapapeles')} className='border border-gray-600 bg-green-600 rounded-lg py-1 px-2 flex gap-2 justify-center items-center cursor-pointer'>
                <Copy size={16} className="cursor-pointer" />
                  Copiar
                </button>
            </div>
      </div>

      {/* AUTOMATICO */}
      <div>
        <p className='uppercase font-bold'>Enlace de registro automatico</p>
        <div className="flex items-center space-x-4">
          <Link size={16} />
          <p className="text-sm text-blue-600">{automaticLink}</p>
          
          <button onClick={() => copyToClipboard(automaticLink, 'Enlace automatico copiado al portapapeles')} className='border border-gray-600 bg-green-600 rounded-lg py-1 px-2 flex gap-2 justify-center items-center cursor-pointer'>
            <Copy size={16} className="cursor-pointer" />
              Copiar
          </button>
        </div>
      </div>
     </div>

     <Toaster />
    </div>
  );
};

export default MembershipContributionsTab;
