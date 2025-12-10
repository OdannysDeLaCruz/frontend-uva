"use client"

import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { AlertCircle, RefreshCw, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { assignParentToUser, getTanqueAffiliates } from '@/app/core/services/user-service';
import { useAuth } from '@/app/core/contexts/auth-context';
import { PublicUserDto } from '@/app/core/types/user';
import { Input } from '@/app/core/ui/input';
import { Button } from '@/app/core/ui/button';
import { Label } from '@/app/core/ui/label';
import { getUserByReferralCode } from '@/app/core/services/user-service';
import { ApiError } from 'next/dist/server/api-utils';
import toast, { Toaster } from 'react-hot-toast';


const TanquePage: React.FC = () => {
  const { theme } = useTheme();
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

  const searchParentByReferralCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorInModal('');
    setSearchingParent(true);
    setParentToAssign(null as unknown as PublicUserDto);
    setError(null);

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

  const tanqueAffiliatesItems = tanqueAffiliates.map((affiliate) => (
    <li key={affiliate.id}>
      <div
        className={`
          flex flex-col justify-between border border-l-3 p-2 mb-2
          ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}
          cursor-pointer
        `}
      >
        {/* Icono de usuario */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
          } mr-2 flex-shrink-0`}
        >
          <User size={15} />
        </div>
      
        {/* Información del usuario */}
        <div className="flex-1 flex items-center flex-wrap justify-between overflow-hidden pr-2">
          <div className="flex flex-col mb-1">
            <p className="font-medium text-sm truncate">{affiliate.name} {affiliate.lastname}</p>
            <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{affiliate.username}</p>
          </div>
          <div className="flex justify-end">
            <button className="text-xs text-blue-500 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded cursor-pointer" onClick={() => handleToggleModal(affiliate)}>Asignar un padre</button>
          </div>
        </div>
      </div>
    </li>
  ));

  if (loadingInitial) {
    return (
      <div className="p-4 flex items-center justify-center">
        <RefreshCw size={24} className="animate-spin mr-2" /> Cargando estructura...
      </div>
    );
  }

  const assignParent = async () => {
    setAssigningParent(true);
    try {
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

      await assignParentToUser(assignParentPayload);
      handleToggleModal(null);

      // Remove affiliate from array
      setTanqueAffiliates(tanqueAffiliates.filter((affiliate) => affiliate.id !== affiliateToAssign.id));

      toast.success("Padre asignado exitosamente", {
        duration: 5000,
        position: "bottom-right",
      });
    } catch (err: ApiError | unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        const errorObj = err as ApiError
        console.error("Error assigning parent:", err);
        setErrorInModal(errorObj.message);
      }
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
        <div className="flex flex-col mb-6">
          <h2 className="text-2xl font-semibold">Mi tanque</h2>
          <p className="text-sm text-gray-500">Pendientes por asignar: {tanqueAffiliates.length}</p>
        </div>
        <div className="flex flex-col gap-6">
          <ul>
            {tanqueAffiliatesItems}
          </ul>
        </div>
        {showModal && (
          // Modal backdrop
          <div className="m-2 fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center" onClick={() => handleToggleModal(null)}>
            <div className="flex flex-col p-4 bg-white rounded-lg z-50 w-[400px]" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col items-start justify-between">
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-lg font-semibold text-gray-900">Buscar un padre para:</h2>
                  <button onClick={() => handleToggleModal(null)} className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">Cerrar</button>
                </div>
                <div className="mt-4 text-sm text-gray-500 border border-green-500 w-full p-2 mb-2 rounded bg-green-50">
                  <div className="flex flex-col">
                    <p><strong>Nombre:</strong> {affiliateToAssign.name}</p>
                    <p><strong>Apellido:</strong> {affiliateToAssign.lastname}</p>
                    <p><strong>Usuario:</strong> {affiliateToAssign.username}</p>
                  </div>
                </div>

              </div>
              {/* Buscador de padreas por codigo de referido */}

              <form action="" onSubmit={searchParentByReferralCode}>
                <Label htmlFor="parentId" className="block text-sm font-medium text-gray-700 my-4">
                  Ingresa el codigo de referido
                </Label>
                <Input
                  required
                  id="parentId"
                  name="parentId"
                  type="text"
                  placeholder="Por ejemplo: BL8IG0G9"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:shadow-none mb-4`}
                />
                <Button 
                  type="submit"
                  disabled={searchingParent}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
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
                      <p className="text-sm font-medium text-gray-500">Padre encontrado:</p>
                      <div className="flex justify-between items-center mt-4 text-sm text-gray-500 border border-green-500 w-full p-2 mb-2 rounded bg-green-50">
                        <div className="flex flex-col">
                          <p><strong>Nombre:</strong> {parentToAssign.name}</p>
                          <p><strong>Apellido:</strong> {parentToAssign.lastname}</p>
                          <p><strong>Usuario:</strong> {parentToAssign.username}</p>
                        </div>
                        <Button 
                          onClick={() => assignParent()}
                          disabled={assigningParent}
                          className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs font-medium text-green-700 border border-green-700 bg-green-200 hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer"
                        >
                          {assigningParent ? (
                            <RefreshCw size={24} className="animate-spin mr-2" />
                          ) : (
                            "ASIGNAR"
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

        <Toaster />
      </div>
    </Layout>
  );
};

export default TanquePage;