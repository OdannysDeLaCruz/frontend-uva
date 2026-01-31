"use client"

import React, { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import Title from '../components/ui/Title'
import { getMyBenefitsQr } from '@/app/core/services/benefits-service'
import { QrBenefit } from '@/app/core/types/benefit'
import QrModal from './components/QrModal'
import QrCard from './components/QrCard'

const MyBenefitsPage: React.FC = () => {
    const [qrs, setQrs] = useState<QrBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState<QrBenefit | null>(null);

    useEffect(() => {
      const loadQrs = async () => {
        try {
            setLoading(true);
          const data = await getMyBenefitsQr()
          setQrs(data);
        } catch (err) {
          console.error("Error loading QRs", err);
        } finally {
          setLoading(false);
        }
      };

      loadQrs();
    }, []);

const activeQrs = qrs.filter(qr => qr.status === "PENDING");
  const usedQrs = qrs.filter(qr => qr.status === "USED");

  if (loading) {
      return (
        <Layout>
          <div className="flex justify-center items-center h-[70vh]">
            <div className="animate-spin h-10 w-10 border-b-2 border-purple-600 rounded-full" />
          </div>
        </Layout>
      );
    }


  return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          <Title title="Mis beneficios" />

          {/* ACTIVOS */}
          <QrCard
            title="Beneficios activos"
            qrs={activeQrs}
            onSelect={setSelectedQr}
          />

          {/* USADOS */}
          <QrCard
            title="Beneficios usados"
            qrs={usedQrs}
            onSelect={setSelectedQr}
          />
        </div>

        {/* MODAL */}
        {selectedQr && (
          <QrModal qr={selectedQr} onClose={() => setSelectedQr(null)} />
        )}
      </Layout>
    );
  };

  export default MyBenefitsPage;