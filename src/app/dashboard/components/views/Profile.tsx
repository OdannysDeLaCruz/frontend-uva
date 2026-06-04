import React, { useEffect } from 'react';
import { User, Mail, Phone, IdCard, AtSign, ShieldCheck, ShieldX, Clock, CreditCard } from 'lucide-react';
import { useAuth } from '@/app/core/contexts/auth-context';
import { useBoldPayment } from '@/app/core/hooks/useBoldPayment';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { membershipInfo, loadMembershipInfo, status } = useBoldPayment();

  useEffect(() => {
    loadMembershipInfo(1);
  }, [loadMembershipInfo]);

  const getDaysRemaining = () => {
    if (!membershipInfo?.subscription?.endDate) return null;
    const end = new Date(membershipInfo.subscription.endDate);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-CO', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

  const getRegularity = (days: number) => {
    if (days <= 7) return 'Semanal';
    if (days <= 31) return 'Mensual';
    if (days <= 366) return 'Anual';
    return `Cada ${days} días`;
  };

  const daysRemaining = getDaysRemaining();
  const isActive = membershipInfo?.hasActiveSubscription && !membershipInfo?.isWithinGracePeriod;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Mi Perfil</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información Personal */}
        <div className="border border-gray-600 rounded-lg p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-200 mb-1">Información Personal</h3>
          {[
            { icon: <User size={15} />, value: `${user?.name} ${user?.lastname}` },
            { icon: <AtSign size={15} />, value: user?.username },
            { icon: <IdCard size={15} />, value: `${user?.doc_type} ${user?.doc_number}` },
            { icon: <Mail size={15} />, value: user?.email },
            { icon: <Phone size={15} />, value: user?.phone },
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-3">
              <span className="text-gray-400 flex-shrink-0">{item.icon}</span>
              <p className="text-sm font-medium text-gray-200">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {/* Estado de la cuenta */}
          <div className="border border-gray-600 rounded-lg p-4 flex items-center space-x-3">
            {user?.isActive ? (
              <>
                <ShieldCheck className="text-green-500 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-green-400">Cuenta Activa</p>
                  <p className="text-xs text-gray-400">Tu cuenta está activa y en buen estado</p>
                </div>
              </>
            ) : (
              <>
                <ShieldX className="text-red-500 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-red-400">Cuenta Inactiva</p>
                  <p className="text-xs text-gray-400">Tu cuenta requiere activación</p>
                </div>
              </>
            )}
          </div>

          {/* Membresía */}
          <div className="border border-gray-600 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-200 flex items-center gap-2">
                <CreditCard size={15} />
                Membresía
              </h3>
              {status === 'loading' ? (
                <span className="text-xs text-gray-500">Cargando...</span>
              ) : isActive ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Activa
                </span>
              ) : membershipInfo?.isWithinGracePeriod ? (
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2 py-0.5 uppercase tracking-wide">
                  Vencida
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-2 py-0.5 uppercase tracking-wide">
                  {membershipInfo?.subscription ? 'Expirada' : 'Sin membresía'}
                </span>
              )}
            </div>

            {membershipInfo ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-gray-200">{membershipInfo.membershipName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Frecuencia</span>
                  <span className="text-gray-200">{getRegularity(membershipInfo.durationDays)}</span>
                </div>
                {membershipInfo.subscription && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Inicio</span>
                      <span className="text-gray-200">{formatDate(membershipInfo.subscription.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vencimiento</span>
                      <span className={isActive ? 'text-emerald-400' : 'text-amber-400'}>
                        {formatDate(membershipInfo.subscription.endDate)}
                      </span>
                    </div>
                    {daysRemaining !== null && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          Tiempo restante
                        </span>
                        <span className={
                          daysRemaining > 7 ? 'text-emerald-400' :
                          daysRemaining > 0 ? 'text-amber-400' :
                          'text-red-400'
                        }>
                          {daysRemaining > 0 ? `${daysRemaining} días` : 'Vencida'}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : status !== 'loading' && (
              <p className="text-sm text-gray-500">No tienes una membresía activa.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
