'use client';

import Script from 'next/script'
import Layout from '@/app/dashboard/components/layout/Layout';
import MembershipTabs from '../components/MembershipTabs';


export default function MembershipPaymentPage() {

  return (
    <Layout>
      <section className="mb-8">
        <h1 className="text-4xl font-semibold text-sky-200 mb-6">ACTIVACIÓN</h1>
        <MembershipTabs />
      </section>

      <Script src="https://checkout.wompi.co/widget.js" />
    </Layout>
  );
}
