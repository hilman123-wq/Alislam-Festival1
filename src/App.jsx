import React, { useState } from 'react';
import { LayoutDashboard, Users, Trophy, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Fungsi Simulasi Login
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  // Tampilan Halaman Login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-green-700">AL ISLAM FESTIVAL</h1>
            <p className="text-gray-500 mt-2">Sistem Manajemen Event 2027</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Panitia</label>
              <input 
                type="email" 
                defaultValue="panitia@alislam.org"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" 
                defaultValue="password123"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Masuk ke Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Tampilan Halaman Utama (Dashboard)
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Kiri */}
      <div className="w-64 bg-green-800 text-white shadow-xl">
        <div className="p-4 border-b border-green-700">
          <h2 className="text-lg font-bold">AL ISLAM FEST 2027</h2>
          <p className="text-green-300 text-sm">Panitia Registrasi</p>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => setActiveMenu('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeMenu === 'dashboard' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <LayoutDashboard size={20} />
            <span>Beranda</span>
          </button>
          <button onClick={() => setActiveMenu('pendaftaran')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeMenu === 'pendaftaran' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <Users size={20} />
            <span>Pendaftaran</span>
          </button>
          <button onClick={() => setActiveMenu('lomba')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeMenu === 'lomba' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <Trophy size={20} />
            <span>Data Lomba</span>
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-green-700">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center space-x-3 px-4 py-2 text-red-300 hover:bg-green-700 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Konten Kanan */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">{activeMenu}</h1>
          <div className="flex items-center space-x-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Status: Persiapan</span>
          </div>
        </header>

        <main className="p-6">
          {activeMenu === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium">Total Pendaftar</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">124</p>
                <div className="mt-4 flex items-center text-sm text-green-600">
                  <CheckCircle size={16} className="mr-1" />
                  <span>89 Terverifikasi</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium">Tugas Panitia</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
                <div className="mt-4 flex items-center text-sm text-yellow-600">
                  <AlertCircle size={16} className="mr-1" />
                  <span>3 Mendekati Tenggat</span>
                </div>
              </div>
            </div>
          )}
          
          {activeMenu !== 'dashboard' && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500 border border-gray-100">
              <p>Halaman <b>{activeMenu}</b> sedang dalam tahap pengembangan (MVP).</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}