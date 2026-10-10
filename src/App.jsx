import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Menu, X, Home, Users, Calendar, Trophy, 
  Settings, LogOut, CheckCircle, AlertTriangle, Briefcase, FileText,
  QrCode, Scan, Search, UserCheck, XCircle, Store, DollarSign, PieChart, MapPin
} from 'lucide-react';

// IMPORT KONEKSI SUPABASE ASLI
import { supabase } from './supabase';

const login = async (username, password) => {
    // Trik mengubah username menjadi format email sistem
    const sistemEmail = `${username.toLowerCase().trim()}@sistem.com`;
    
    // MENGGUNAKAN SUPABASE ASLI
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: sistemEmail, 
      password: password 
    });
    
    if (error) {
      throw new Error("Username atau Password salah! Pastikan sudah terdaftar di Supabase.");
    }
    
    setUser(data.user);
    
    // Set Role (Nantinya ini akan ditarik dari tabel user_event_roles)
    const uname = username.toLowerCase().trim();
    if (uname === 'admin') {
      setUserRole('Super Admin');
      setUserDivision('Semua Divisi');
    } else if (uname === 'keuangan') {
      setUserRole('Koordinator Divisi');
      setUserDivision('Keuangan');
    } else {
      setUserRole('Koordinator Divisi');
      setUserDivision('Acara & Lomba');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeEvent] = useState({ id: 1, name: 'AL ISLAM FESTIVAL 2027', year: 2027, status: 'Persiapan' });
  const [userRole, setUserRole] = useState('Koordinator Divisi');
  const [userDivision, setUserDivision] = useState('Acara & Lomba');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const login = async (username, password) => {
    // Kita lempar username ke dalam parameter email untuk simulasi
    const { data, error } = await mockSupabase.auth.signInWithPassword({ email: username, password });
    if (error) throw error;
    setUser(data.user);
    
    // Set Role & Divisi otomatis berdasarkan Username yang diketik
    const uname = username.toLowerCase();
    if (uname === 'admin') {
      setUserRole('Super Admin');
      setUserDivision('Semua Divisi');
    } else if (uname === 'keuangan') {
      setUserRole('Koordinator Divisi');
      setUserDivision('Keuangan');
    } else if (uname === 'registrasi') {
      setUserRole('Panitia Inti');
      setUserDivision('Registrasi');
    } else if (uname === 'sponsor') {
      setUserRole('Koordinator Divisi');
      setUserDivision('Humas & Sponsor');
    } else if (uname === 'bazar') {
      setUserRole('Panitia Lapangan');
      setUserDivision('Bazar & Expo');
    } else {
      setUserRole('Koordinator Lomba');
      setUserDivision('Acara & Lomba');
    }
  };

  const logout = async () => {
    await mockSupabase.auth.signOut();
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ 
      user, userRole, userDivision, activeEvent, 
      login, logout, isSidebarOpen, setIsSidebarOpen 
    }}>
      {children}
    </AppContext.Provider>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', isLoading = false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    danger: "bg-red-50 hover:bg-red-100 text-red-600",
  };
  return (
    <button 
      type={type} onClick={onClick} disabled={isLoading}
      className={`${baseStyle} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
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
    setLoading(true);
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">AL</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Al Islam Festival</h2>
        <p className="mt-2 text-center text-sm text-slate-600">Masuk ke portal manajemen panitia</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <input 
                type="text" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="Contoh: admin atau keuangan" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="password123" 
              />
            </div>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2"><AlertTriangle className="w-5 h-5 flex-shrink-0" /><p>{error}</p></div>}
            <Button type="submit" className="w-full" isLoading={loading}>Masuk Sistem</Button>
            
            <div className="text-center text-xs text-slate-500 mt-6 pt-4 border-t border-slate-200 flex flex-col gap-1.5">
              <p className="font-semibold text-slate-700 mb-1">Daftar Username (Password: password123):</p>
              <span>✅ admin</span>
              <span>✅ keuangan</span>
              <span>✅ registrasi</span>
              <span>✅ lomba</span>
              <span>✅ sponsor</span>
              <span>✅ bazar</span>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

const Layout = ({ children, activePage, setActivePage }) => {
  const { userRole, userDivision, activeEvent, logout, isSidebarOpen, setIsSidebarOpen } = useContext(AppContext);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'pendaftaran', label: 'Pendaftaran', icon: <Users size={20} /> },
    { id: 'checkin', label: 'Scan Check-in', icon: <Scan size={20} /> },
    { id: 'lomba', label: 'Manajemen Lomba', icon: <Trophy size={20} /> },
    { id: 'sponsor', label: 'Humas & Sponsor', icon: <Briefcase size={20} /> },
    { id: 'bazar', label: 'Bazar & Expo', icon: <Store size={20} /> },
  ];

  if (userRole === 'Super Admin' || userDivision === 'Keuangan') {
    navItems.push({ id: 'keuangan', label: 'Keuangan (RAB)', icon: <DollarSign size={20} /> });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 h-screen w-72 bg-slate-900 text-white z-30 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-lg">AL</div>
            <h1 className="font-bold leading-tight">Al Islam<br/>Festival</h1>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item, idx) => (
            <button key={idx} onClick={() => { setActivePage(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activePage === item.id ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
              {item.icon} <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center"><Users size={18} /></div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Div. {userDivision}</p>
              <p className="text-xs text-emerald-400 truncate">{userRole}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-sm font-medium transition-colors">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 sm:px-6 justify-between lg:justify-end">
          <button className="lg:hidden text-slate-600" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Status Event: {activeEvent.status}
          </span>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => (
  <div className="space-y-6 animate-in fade-in">
    <h1 className="text-2xl font-bold text-slate-900">Dashboard Utama</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <h3 className="text-slate-500 text-sm font-medium">Pendaftar Terverifikasi</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">89</p>
        <div className="mt-4 flex items-center text-sm text-emerald-600">
          <CheckCircle size={16} className="mr-1" /> <span>Siap Lomba</span>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-slate-500 text-sm font-medium">Total Sponsor (Deal)</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">Rp 15jt</p>
        <div className="mt-4 flex items-center text-sm text-emerald-600">
          <Briefcase size={16} className="mr-1" /> <span>Dari 3 Instansi</span>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-slate-500 text-sm font-medium">Tenant Bazar Lunas</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">4</p>
        <div className="mt-4 flex items-center text-sm text-orange-600">
          <Store size={16} className="mr-1" /> <span>Sisa 6 Booth</span>
        </div>
      </Card>
    </div>
  </div>
);

const RegistrationModule = () => {
  const [registrations, setRegistrations] = useState([
    { id: 'R001', school: 'SDIT Bina Insan', type: 'Futsal', category: 'SD', status: 'Menunggu Verifikasi', code: 'ALF-FS-001' },
    { id: 'R002', school: 'SMPN 1 Bandung', type: 'Pidato', category: 'SMP', status: 'Terverifikasi', code: 'ALF-PD-002' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Data Pendaftar</h1>
      </div>
      <Card>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium">Sekolah</th>
              <th className="p-4 font-medium">Lomba</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {registrations.map(reg => (
              <tr key={reg.id}>
                <td className="p-4"><p className="font-medium text-slate-900">{reg.school}</p><p className="text-xs text-slate-500">{reg.code}</p></td>
                <td className="p-4 text-sm">{reg.type} ({reg.category})</td>
                <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-full ${reg.status === 'Terverifikasi' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{reg.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const CheckInModule = () => (
  <div className="space-y-6 animate-in fade-in">
    <h1 className="text-2xl font-bold text-slate-900">Scanner Check-in</h1>
    <Card className="p-12 flex flex-col items-center justify-center bg-slate-900 text-white min-h-[400px]">
      <QrCode className="w-32 h-32 text-emerald-400 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Siap Memindai</h2>
      <p className="text-slate-400 mb-6">Arahkan kamera ke QR Code peserta.</p>
      <div className="flex gap-2 w-full max-w-sm">
        <input type="text" placeholder="Atau ketik ALF-xxx" className="flex-1 px-4 py-2 rounded-lg text-slate-900" />
        <Button variant="primary">Cek</Button>
      </div>
    </Card>
  </div>
);

const CompetitionModule = () => (
  <div className="space-y-6 animate-in fade-in">
    <h1 className="text-2xl font-bold text-slate-900">Penilaian Lomba</h1>
    <Card className="p-6">
      <h3 className="font-semibold text-slate-800 mb-4">Form Juri: Pidato Bahasa Indonesia</h3>
      <div className="space-y-4 max-w-lg">
        <div><label className="block text-sm font-medium mb-1">Materi & Isi (40%)</label><input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="0-100" /></div>
        <div><label className="block text-sm font-medium mb-1">Vokal & Intonasi (30%)</label><input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="0-100" /></div>
        <div><label className="block text-sm font-medium mb-1">Penampilan (30%)</label><input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="0-100" /></div>
        <Button className="w-full mt-4">Simpan Nilai</Button>
      </div>
    </Card>
  </div>
);

const SponsorModule = () => (
  <div className="space-y-6 animate-in fade-in">
    <h1 className="text-2xl font-bold text-slate-900">Humas & Sponsor</h1>
    <Card>
      <div className="p-4 border-b bg-slate-50"><h3 className="font-semibold text-slate-800">Pipeline Relasi</h3></div>
      <table className="w-full text-left">
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="p-4">Bank Syariah Indonesia (BSI)<br/><span className="text-xs text-slate-500">Paket Gold - Rp 10.000.000</span></td>
            <td className="p-4 text-right"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Deal Selesai</span></td>
          </tr>
          <tr>
            <td className="p-4">Penerbit Erlangga<br/><span className="text-xs text-slate-500">Paket Silver - Rp 5.000.000</span></td>
            <td className="p-4 text-right"><span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Negosiasi</span></td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
);

const BazarModule = () => (
  <div className="space-y-6 animate-in fade-in">
    <h1 className="text-2xl font-bold text-slate-900">Bazar UMKM</h1>
    <Card>
      <div className="p-4 border-b bg-slate-50"><h3 className="font-semibold text-slate-800">Daftar Tenant</h3></div>
      <table className="w-full text-left">
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="p-4">Kedai Kopi Santri<br/><span className="text-xs text-slate-500">Bazar UMKM</span></td>
            <td className="p-4 text-center"><span className="px-2 py-1 bg-slate-800 text-white rounded text-xs">Booth A-01</span></td>
            <td className="p-4 text-right"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Lunas</span></td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
);

const FinanceModule = () => (
  <div className="space-y-6 animate-in fade-in">
    <h1 className="text-2xl font-bold text-slate-900">Keuangan & RAB</h1>
    <div className="grid grid-cols-2 gap-4">
      <Card className="p-6 bg-emerald-50"><p className="text-sm text-emerald-800">Pemasukan</p><h2 className="text-2xl font-bold text-emerald-600">Rp 25.500.000</h2></Card>
      <Card className="p-6 bg-red-50"><p className="text-sm text-red-800">Pengeluaran</p><h2 className="text-2xl font-bold text-red-600">Rp 8.200.000</h2></Card>
    </div>
    <Card>
      <div className="p-4 border-b bg-slate-50"><h3 className="font-semibold text-slate-800">Riwayat Transaksi</h3></div>
      <table className="w-full text-left text-sm">
        <tbody className="divide-y divide-slate-100">
          <tr><td className="p-4">DP Panggung Utama<br/><span className="text-xs text-slate-500">01 Nov 2026</span></td><td className="p-4 text-right text-red-600">- 5.000.000</td></tr>
          <tr><td className="p-4">Cair Dana Sponsor BSI<br/><span className="text-xs text-slate-500">03 Nov 2026</span></td><td className="p-4 text-right text-emerald-600">+ 10.000.000</td></tr>
        </tbody>
      </table>
    </Card>
  </div>
);

const AppContent = () => {
  const { user } = useContext(AppContext);
  const [activePage, setActivePage] = useState('dashboard');
  if (!user) return <LoginScreen />;
  
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'pendaftaran': return <RegistrationModule />;
      case 'checkin': return <CheckInModule />;
      case 'lomba': return <CompetitionModule />;
      case 'sponsor': return <SponsorModule />;
      case 'bazar': return <BazarModule />;
      case 'keuangan': return <FinanceModule />;
      default: return <Dashboard />;
    }
  };
  return <Layout activePage={activePage} setActivePage={setActivePage}>{renderPage()}</Layout>;
};

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}