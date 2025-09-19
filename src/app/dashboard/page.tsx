"use client"

import React from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './components/views/Dashboard';
import { ThemeProvider } from 'next-themes';

function App() {

  return (
    <ThemeProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </ThemeProvider>
  );
}

export default App;