import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Menu, X, Home, Users, Calendar, Trophy, 
  Settings, LogOut, CheckCircle, AlertTriangle, Briefcase, FileText,
  QrCode, Scan, Search, UserCheck, XCircle, Store, DollarSign, Plus
} from 'lucide-react';

import { supabase } from './supabase';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeEvent] = useState({ id: 1, name: 'AL ISLAM FESTIVAL 2027', status: 'Pendaftaran Dibuka' });
  const [userRole, setUserRole] = useState('');
  const [userDivision, setUserDivision] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Cek sesi login yang tersimpan
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setRoleFromEmail(session.user.email);
      }
    });
  }, []);

  const setRoleFromEmail = (email) => {
    const uname = email.split('@')[0].toLowerCase();
    if (uname === 'admin') { setUserRole('Super Admin'); setUserDivision('Semua Divisi'); }
    else if (uname === 'keuangan') { setUserRole('Koordinator Divisi'); setUserDivision('Keuangan'); }
    else if (uname === 'registrasi') { setUserRole('Panitia Inti'); setUserDivision('Registrasi'); }
    else { setUserRole('Panitia Lomba'); setUserDivision('Acara & Lomba'); }
  };

  const login = async (username, password) => {
    const sistemEmail = `${username.toLowerCase().trim()}@sistem.com`;
    const { data, error } = await supabase.auth.signInWithPassword({ email: sistemEmail, password });
    if (error) throw new Error("Username atau Password salah!");
    setUser(data.user);
    setRoleFromEmail(sistemEmail);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, userRole, userDivision, activeEvent, login, logout, isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </AppContext.Provider>
  );
};

// Komponen Tombol yang Lebih Elegan
const Button = ({ children, onClick, variant = 'primary', className = '', type="button" }) => {
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm",
    secondary: "bg-white border border-slate-300 hover:bg-slate-50 text-slate-700",
    danger: "bg-red-50 hover:bg-red-100 text-red-600",
  };
  return (
    <button type={type} onClick={onClick} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const LoginScreen = () => {
  const { login } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(username, password); } 
    catch (err) { setError(err.message); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 text-white text-2xl font-bold">AL</div>
          <h1 className="text-2xl font-bold text-slate-800">Al Islam Festival</h1>
          <p className="text-slate-500 text-sm mt-1">Portal Manajemen Panitia 2027</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username Divisi</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Contoh: admin atau registrasi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="••••••••" />
          </div>
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2"><AlertTriangle size={16} />{error}</div>}
          <Button type="submit" className="w-full py-3" isLoading={loading}>{loading ? 'Memproses...' : 'Masuk ke Sistem'}</Button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// MODUL PENDAFTARAN (SUDAH DI-SEMPURNAKAN)
// ==========================================
const RegistrationModule = () => {
  // State interaktif
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLomba, setFilterLomba] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  
  // Data State (Nantinya diganti dengan fetch dari Supabase)
  const [registrations, setRegistrations] = useState([
    { id: 1, school: 'SDIT Bina Insan', type: 'Futsal', category: 'SD', status: 'Menunggu Verifikasi', code: 'ALF-FS-001', date: '10 Okt 2026' },
    { id: 2, school: 'SMPN 1 Bandung', type: 'Pidato B. Indonesia', category: 'SMP', status: 'Terverifikasi', code: 'ALF-PD-002', date: '09 Okt 2026' },
    { id: 3, school: 'SD Al Falah', type: 'MHQ', category: 'SD', status: 'Perlu Perbaikan', code: 'ALF-MQ-003', date: '09 Okt 2026' },
    { id: 4, school: 'SMP Nurul Fikri', type: 'Olimpiade Matematika', category: 'SMP', status: 'Terverifikasi', code: 'ALF-OM-004', date: '08 Okt 2026' },
  ]);

  // Form State untuk tambah data
  const [formData, setFormData] = useState({ school: '', type: 'Futsal' });

  // Fungsi Verifikasi (Berfungsi Nyata di UI)
  const handleVerify = (id) => {
    setRegistrations(registrations.map(reg => reg.id === id ? { ...reg, status: 'Terverifikasi' } : reg));
  };

  // Fungsi Tambah Data (Berfungsi Nyata di UI)
  const handleAddData = (e) => {
    e.preventDefault();
    const newData = {
      id: Date.now(),
      school: formData.school,
      type: formData.type,
      category: formData.type === 'Futsal' || formData.type === 'MHQ' ? 'SD' : 'SMP',
      status: 'Menunggu Verifikasi',
      code: `ALF-NEW-${Math.floor(Math.random() * 1000)}`,
      date: 'Hari Ini'
    };
    setRegistrations([newData, ...registrations]);
    setShowModal(false);
    setFormData({ school: '', type: 'Futsal' });
  };

  // Logika Pencarian & Filter
  const filteredData = registrations.filter(reg => {
    const matchSearch = reg.school.toLowerCase().includes(searchTerm.toLowerCase()) || reg.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterLomba === 'Semua' || reg.type.includes(filterLomba);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pendaftaran</h1>
          <p className="text-slate-500 text-sm mt-1">Verifikasi berkas, kelola tim sekolah, dan status pendaftar.</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={18} /> Tambah Peserta</Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar Pencarian & Filter */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Cari nama sekolah atau kode QR..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
          <select value={filterLomba} onChange={(e) => setFilterLomba(e.target.value)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm min-w-[200px] focus:ring-emerald-500 focus:border-emerald-500">
            <option value="Semua">Tampilkan Semua Lomba</option>
            <option value="Futsal">Futsal</option>
            <option value="Pidato">Pidato B. Indonesia</option>
            <option value="MHQ">MHQ</option>
            <option value="Olimpiade">Olimpiade Matematika</option>
          </select>
        </div>

        {/* Tabel Data Dinamis */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                <th className="p-4 font-semibold">Kode & Sekolah</th>
                <th className="p-4 font-semibold">Jenis Lomba</th>
                <th className="p-4 font-semibold">Tanggal Daftar</th>
                <th className="p-4 font-semibold">Status Pendaftaran</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? filteredData.map(reg => (
                <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{reg.school}</p>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{reg.code}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-slate-700">{reg.type}</p>
                    <span className="inline-block mt-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{reg.category}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{reg.date}</td>
                  <td className="p-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
                      reg.status === 'Terverifikasi' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      reg.status === 'Perlu Perbaikan' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {reg.status !== 'Terverifikasi' && (
                      <button onClick={() => handleVerify(reg.id)} className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg font-bold transition-colors">
                        Verifikasi
                      </button>
                    )}
                    <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-medium transition-colors">Detail</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Tidak ada pendaftar yang cocok dengan pencarian Anda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Data */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Tambah Peserta Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddData} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Sekolah</label>
                <input type="text" required value={formData.school} onChange={(e)=>setFormData({...formData, school: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500" placeholder="Contoh: SD Muhammadiyah 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Lomba</label>
                <select value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500">
                  <option value="Futsal">Futsal</option>
                  <option value="Pidato B. Indonesia">Pidato B. Indonesia</option>
                  <option value="MHQ">MHQ</option>
                  <option value="Olimpiade Matematika">Olimpiade Matematika</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <Button variant="secondary" onClick={() => setShowModal(false)}>Batal</Button>
                <Button type="submit">Simpan Pendaftar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// STRUKTUR HALAMAN & ROUTING
// ==========================================
const Dashboard = () => (
  <div className="space-y-6 animate-in fade-in">
    <h1 className="text-2xl font-bold text-slate-900">Beranda Festival</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><h3 className="text-slate-500 text-sm font-medium">Pendaftar Masuk</h3><p className="text-4xl font-bold text-slate-800 mt-2">124</p></div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><h3 className="text-slate-500 text-sm font-medium">Sponsor Deal</h3><p className="text-4xl font-bold text-slate-800 mt-2">Rp 15 Juta</p></div>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><h3 className="text-slate-500 text-sm font-medium">Lapak Bazar Terisi</h3><p className="text-4xl font-bold text-slate-800 mt-2">4/10</p></div>
    </div>
  </div>
);

const AppContent = () => {
  const { user, userRole, userDivision, activeEvent, logout, isSidebarOpen, setIsSidebarOpen } = useContext(AppContext);
  const [activePage, setActivePage] = useState('dashboard');
  
  if (!user) return <LoginScreen />;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: <Home size={20} /> },
    { id: 'pendaftaran', label: 'Pendaftaran & Peserta', icon: <Users size={20} /> },
    { id: 'checkin', label: 'Scanner Kehadiran', icon: <Scan size={20} /> },
    { id: 'lomba', label: 'Sistem Penilaian Juri', icon: <Trophy size={20} /> },
    { id: 'sponsor', label: 'Humas & Sponsorship', icon: <Briefcase size={20} /> },
    { id: 'bazar', label: 'Manajemen Bazar', icon: <Store size={20} /> },
  ];

  if (userRole === 'Super Admin' || userDivision === 'Keuangan') {
    navItems.push({ id: 'keuangan', label: 'Laporan Kas (RAB)', icon: <DollarSign size={20} /> });
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'pendaftaran': return <RegistrationModule />;
      // Modul lain disederhanakan sebagai placeholder untuk fokus ke penyempurnaan Pendaftaran
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
          <Settings className="w-16 h-16 mb-4 opacity-20 text-slate-400" />
          <h2 className="text-xl font-bold text-slate-700">Modul sedang diintegrasikan</h2>
          <p className="text-sm mt-2 text-center max-w-md">Tahap ini difokuskan pada penyempurnaan fitur Formulir dan Filter di menu Pendaftaran. Silakan cek menu <b>Pendaftaran & Peserta</b>.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Gelap Elegan */}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 h-screen w-72 bg-[#0f172a] text-slate-300 z-30 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-2xl`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">AL</div>
            <div>
              <h1 className="font-bold leading-tight text-white">Al Islam Festival</h1>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">VERSI 1.0 (BETA)</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActivePage(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activePage === item.id ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
              {item.icon} <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-5 border-t border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-slate-700"><Users size={18} /></div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{userDivision}</p>
              <p className="text-xs text-emerald-400 truncate">{userRole}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-red-500 hover:text-white rounded-lg text-sm font-medium transition-colors border border-slate-700 hover:border-red-500">
            <LogOut size={16} /> Keluar Sistem
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 sm:px-6 justify-between lg:justify-end shadow-sm z-10">
          <button className="lg:hidden text-slate-600 p-2 -ml-2 rounded-lg hover:bg-slate-100" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
            {activeEvent.status}
          </span>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative bg-slate-50/50">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default function App() { return <AppProvider><AppContent /></AppProvider>; }