import React from 'react';
import { useTheme } from 'next-themes';
import { User, Mail, Phone, IdCard, Link, Copy, Hash, AtSign } from 'lucide-react';
import { useAuth } from '@/app/core/contexts/auth-context';
import toast, { Toaster } from 'react-hot-toast';

const Profile: React.FC = () => {
  const { theme } = useTheme();
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Perfil</h2>
      </div>

      <div className="flex flex-col gap-6">
        {/* Datos personales */}
        <div className="border border-gray-600 rounded-lg p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <User size={16} />
              <p className="text-sm font-medium">{user?.name} {user?.lastname}</p>
            </div>
            <div className="flex items-center space-x-4">
              <AtSign size={16} />
              <p className="text-sm font-medium">{user?.username}</p>
            </div>

            <div className="flex items-center space-x-4">
              <IdCard size={16} />
              <p className="text-sm font-medium">{user?.doc_number}</p>
            </div>

            <div className="flex items-center space-x-4">
              <Mail size={16} />
              <p className="text-sm font-medium">{user?.email}</p>
            </div>

            <div className="flex items-center space-x-4">
              <Phone size={16} />
              <p className="text-sm font-medium">{user?.phone}</p>
            </div>
          </div>
          
        </div>

        {/* Link de referencia */}
        <div className="border border-gray-600 rounded-lg p-4">
          <p className="text-sm font-semibold mb-2">Mis enlaces de referido</p>
          <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Puedes usar estos enlaces para afiliar a nuevos miembros. Copia y pega los enlaces para compartirlos con tus amigos, familiares, en redes sociales, etc. Puedes usar el enlace <strong>automatico</strong> para que los nuevos miembros queden registrados y ubicados automaticamente en tu lista de referidos sin interacción tuya. Puedes usar el enlace <strong>manual</strong> para enviar a los nuevos miembros a la sección <strong>Mi tanque</strong>, una vez allí podrás ubicarlos en cualquier espacio disponible donde quieras.</p>
          <div className="flex flex-col space-y-4">
            {/* Automatico */}
            <div className="flex items-center space-x-4">
              <Link size={16} />
              <p className="text-sm text-blue-600">{automaticLink}</p>
              <Copy size={16} className="cursor-pointer" onClick={() => copyToClipboard(automaticLink, 'Enlace automatico copiado al portapapeles')} />
            </div>
            {/* Manual */}
            <div className="flex items-center space-x-4">
              <Link size={16} />
              <p className="text-sm text-blue-600">{manualLink}</p>
              <Copy size={16} className="cursor-pointer" onClick={() => copyToClipboard(manualLink, 'Enlace manual copiado al portapapeles')} />
            </div>
          </div>
        </div>

        {/* Datos de la membresia */}
        <div className="border border-gray-600 rounded-lg p-4">
          {/* Descripcion */}
          <p className="text-sm font-medium mb-2">Membresia</p>

          <div className="flex flex-col space-y-4">
            {user?.membershipId
            ? (
              <div className="flex items-center space-x-4" >
                <p className="text-sm font-medium">{user?.membershipId}</p>
              </div>
            )
            : (
              <div className="flex items-center space-x-4" >
                <p className="text-sm font-medium">No tienes membresia</p>
              </div>
            )}
          </div>
        </div>

        {/* Datos de la referencia */}
        <div className="border border-gray-600 rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Código de referencia</p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <IdCard size={16} />
              <p className="text-sm font-medium">{user?.referralCode}</p>
              <Copy size={16} className="cursor-pointer" onClick={() => copyToClipboard(user?.referralCode || "", 'Código de referencia copiado al portapapeles')} />
            </div>
          </div>
        </div>

        {/* Numero de rifa */}
        <div className="border border-gray-600 rounded-lg p-4">
          {/* Descripcion */}
          <p className="text-sm font-medium mb-2">Numero de rifa</p>
          <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>El número de rifa es un identificador único que se asigna a cada usuario al momento de su registro. Este número es utilizado para identificar a cada usuario cuando se realizan rifas.</p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Hash size={16} />
              <p className="text-sm font-medium">{user?.raffleNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Profile;