import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { WaterQualityProvider } from './context/WaterQualityContext';

function App() {
  return (
    <WaterQualityProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Dashboard />
        </main>
        <footer className="bg-slate-800 text-slate-300 py-4 text-center text-sm">
          © 2025 All rights reserved by Lazy Programmer
        </footer>
      </div>
    </WaterQualityProvider>
  );
}

export default App;