"use client"

import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { assignParentToUser, getTanqueAffiliates } from '@/app/core/services/user-service';
import { useAuth } from '@/app/core/contexts/auth-context';
import { PublicUserDto } from '@/app/core/types/user';
import { Input } from '@/app/core/ui/input';
import { Button } from '@/app/core/ui/button';
import { Label } from '@/app/core/ui/label';
import { getUserByReferralCode } from '@/app/core/services/user-service';
import { ApiError } from 'next/dist/server/api-utils';
import toast, { Toaster } from 'react-hot-toast';
import { AssignParentDto } from '@/app/core/types/mlm';
import { ServerAlert } from '@/app/core/ui/alert-dialog';


const TanquePage: React.FC = () => {
  const { user } = useAuth();

  const [tanqueAffiliates, setTanqueAffiliates] = useState<PublicUserDto[]>([]);
  const [referralCode, setReferralCode] = useState<string>("");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorInModal, setErrorInModal] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchingParent, setSearchingParent] = useState(false);
  const [affiliateToAssign, setAffiliateToAssign] = useState<PublicUserDto>({} as PublicUserDto);
  const [parentToAssign, setParentToAssign] = useState<PublicUserDto>(null as unknown as PublicUserDto);
  const [assigningParent, setAssigningParent] = useState(false);
  const [showAutoAssignConfirm, setShowAutoAssignConfirm] = useState(false);
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);

  const handleToggleModal = (affiliate: PublicUserDto | null) => {
    setErrorInModal('');
    setError(null);
    setReferralCode("");
    setParentToAssign(null as unknown as PublicUserDto);
    setAffiliateToAssign({} as PublicUserDto);

    setShowModal(!showModal);
    if (affiliate) {
      setAffiliateToAssign(affiliate);
    } else {
      setAffiliateToAssign({} as PublicUserDto);
    }
  };

  const getParentByReferralCode = async (referralCode: string) => {
    try {
      const parent = await getUserByReferralCode(referralCode);
      setParentToAssign(parent)
    } catch (err: ApiError | unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        const errorObj = err as ApiError
        console.error("Error fetching parent:", err);
        if (errorObj.statusCode === 404 ) {
          setErrorInModal(errorObj.message);
        } else {
          setError(errorObj.message);
        }
      }
    } finally {
      setSearchingParent(false);
    }
  }

  const searchParentByReferralCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorInModal('');
    setSearchingParent(true);
    setParentToAssign(null as unknown as PublicUserDto);
    setError(null);

    getParentByReferralCode(referralCode);
  };

  useEffect(() => {
    const fetchTanqueUsers = async () => {
      setLoadingInitial(true);
      setError(null);

      try {
        const tanqueAffiliates = await getTanqueAffiliates(user?.id || 0);
        setTanqueAffiliates(tanqueAffiliates);
      } catch (err) {
        console.error("Error fetching tanque users:", err);
        setError("No se pudieron cargar los usuarios del tanque.");
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchTanqueUsers();
  }, [user]);

  const tanqueAffiliatesRows = tanqueAffiliates.map((affiliate, index) => (
    <tr
      key={affiliate.id}
      className={`
        ${index % 2 === 0 ? 'bg-purple-500' : 'transparent'}
        hover:opacity-90 transition-opacity
      `}
    >
      <td className="px-2 py-3 text-white font-bold text-center w-12">
        {index + 1}
      </td>
      <td className="px-4 py-3 text-white">
        <div className="flex flex-col">
          <p className="font-medium text-xl">{affiliate.name} {affiliate.lastname}</p>
          {/* <p className="text-xs opacity-80">{affiliate.username}</p> */}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg cursor-pointer uppercase text-sm"
          onClick={() => handleToggleModal(affiliate)}
        >
          Colocación
        </button>
      </td>
    </tr>
  ));

  if (loadingInitial) {
    return (
      <div className="p-4 flex items-center justify-center">
        <RefreshCw size={24} className="animate-spin mr-2" /> Cargando estructura...
      </div>
    );
  }

  const assignParent = async (assignParentPayload: AssignParentDto) => {
    try {
      await assignParentToUser(assignParentPayload);
      handleToggleModal(null);

      // Remove affiliate from array
      setTanqueAffiliates(tanqueAffiliates.filter((affiliate) => affiliate.id !== affiliateToAssign.id));

    } catch (err: ApiError | unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        const errorObj = err as ApiError
        console.error("Error assigning parent:", err);
        setErrorInModal(errorObj.message);
      }
    }
  };

  const autoAssignParent = async () => {
    if (user) {
      const assignParentPayload = {
        affiliateId: affiliateToAssign.id,
        parentId: user.id,
        tanqueOwnerId: user.id
      }

      await assignParent(assignParentPayload);

      toast.success("Autoasignación exitosa", {
        duration: 5000,
        position: "bottom-right",
      });
    }
  }
  
  const handleAssignParent = async () => {
    try {
      setAssigningParent(true);

      if (!user) {
        throw new Error("User not found");
      }
      
      if (!affiliateToAssign || !parentToAssign) {
        throw new Error("Affiliate or parent not found");
      }

      const assignParentPayload = {
        affiliateId: affiliateToAssign.id,
        parentId: parentToAssign.id,
        tanqueOwnerId: user.id
      }

      await assignParent(assignParentPayload);

      toast.success("Padre asignado exitosamente", {
        duration: 5000,
        position: "bottom-right",
      });
    } finally {
      setAssigningParent(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center">
        <AlertCircle size={24} className="mr-2" /> Error al cargar la estructura.
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <h2 className="text-3xl text-blue-100 font-semibold text-nowrap mr-6">UVA AMIGOS</h2>
          <div className='w-full h-[1px] bg-blue-200'></div>
          {/* <p className="text-sm text-gray-500">Pendientes por asignar: {tanqueAffiliates.length}</p> */}
        </div>
        <div className="flex flex-col gap-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-white">
                  <th className="px-2 py-3 text-center font-semibold text-xl w-12">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-xl">TANK (Reserva)</th>
                  <th className="px-4 py-3 text-right font-semibold text-xl">Acciones</th>
                </tr>
              </thead>
              <tbody>
                { tanqueAffiliates.length == 0 && (
                  <tr><td colSpan={3} className="text-center py-4">
                    No hay usuarios en el tanque
                    </td></tr>
                )}

                {tanqueAffiliates.length > 0 && tanqueAffiliatesRows}
              </tbody>
            </table>
          </div>
        </div>
        {showModal && (
          // Modal backdrop
          <div className="m-2 fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center" onClick={() => handleToggleModal(null)}>
            <div className="flex flex-col p-4 bg-white rounded-lg z-50 w-[400px]" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col items-start justify-between">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-lg font-semibold text-gray-900">Colocación en estructura de referidos</h2>
                  <button onClick={() => handleToggleModal(null)} className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-1 rounded cursor-pointer">
                    <X size={24} />
                  </button>
                </div>
                <div className="mt-4 text-sm text-gray-500 border border-green-500 w-full p-2 mb-2 rounded bg-green-50">
                  <div className="text-center">
                    <p><strong>Colocando a:</strong> <br /> {affiliateToAssign.name} {affiliateToAssign.lastname}</p>
                    {/* <p><strong>Apellido:</strong> {affiliateToAssign.lastname}</p> */}
                    {/* <p><strong>Usuario:</strong> {affiliateToAssign.username}</p> */}
                  </div>
                </div>

              </div>
              {/* Buscador de padreas por codigo de referido */}

              <form action="" onSubmit={searchParentByReferralCode}>
                <Label htmlFor="parentId" className="block text-base font-medium text-gray-700 my-4 text-center">
                  ¿Bajo de quien quieres colocarlo?
                </Label>
                <Input
                  required
                  id="parentId"
                  name="parentId"
                  type="text"
                  placeholder="Ingresa el codigo de referido, ej: BL8IG0G9"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:shadow-none mb-6 bg-white outline-none text-center`}
                />

                {/* Boton para autoasignarlo */}
                <Button
                  type="button"
                  onClick={() => setShowAutoAssignConfirm(true)}
                  disabled={searchingParent}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer"
                >
                  Autoasignar
                </Button>

                <Button 
                  type="submit"
                  disabled={searchingParent}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer"
                >
                  {searchingParent ? (
                    <RefreshCw size={24} className="animate-spin mr-2" />
                  ) : (
                    "Buscar"
                  )}
                </Button>

                {/* Result */}
                {parentToAssign && (
                  <div className="flex mt-4">
                    <div className="flex flex-col mb-2 w-full">
                      <p className="text-sm font-medium text-gray-500">Resultados</p>
                      <div className="flex justify-between items-center mt-4 text-sm text-gray-500 border border-green-500 w-full p-2 mb-2 rounded bg-green-50">
                        <div className="flex flex-col">
                          <p><strong>Nombre:</strong> {parentToAssign.name}</p>
                          <p><strong>Apellido:</strong> {parentToAssign.lastname}</p>
                          <p><strong>Codigo:</strong> {parentToAssign.referralCode}</p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => setShowAssignConfirm(true)}
                          disabled={assigningParent}
                          className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs font-medium text-green-700 border border-green-700 bg-green-200 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer"
                        >
                          {assigningParent ? (
                            <RefreshCw size={24} className="animate-spin mr-2" />
                          ) : (
                            "COLOCAR"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {errorInModal && (
                  <div className="mt-4">
                    <p className="text-sm text-red-500">{errorInModal}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        <ServerAlert
          open={showAutoAssignConfirm}
          onOpenChange={setShowAutoAssignConfirm}
          variant="warning"
          title="Confirmar autoasignación"
          description={`¿Estás seguro de que deseas colocar a ${affiliateToAssign.name} ${affiliateToAssign.lastname} directamente bajo tu estructura?`}
          showCancel={true}
          cancelText="Cancelar"
          confirmText="Sí, autoasignar"
          onConfirm={autoAssignParent}
          onCancel={() => setShowAutoAssignConfirm(false)}
        />

        <ServerAlert
          open={showAssignConfirm}
          onOpenChange={setShowAssignConfirm}
          variant="warning"
          title="Confirmar colocación"
          description={`¿Estás seguro de que deseas colocar a ${affiliateToAssign.name} ${affiliateToAssign.lastname} bajo ${parentToAssign?.name} ${parentToAssign?.lastname}?`}
          showCancel={true}
          cancelText="Cancelar"
          confirmText="Sí, colocar"
          onConfirm={handleAssignParent}
          onCancel={() => setShowAssignConfirm(false)}
        />

        <Toaster />
      </div>
    </Layout>
  );
};

export default TanquePage;