import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Menu, X, Home, Users, Calendar, Trophy, 
  Settings, LogOut, CheckCircle, Clock, AlertTriangle, Briefcase, FileText,
  QrCode, Scan, Search, UserCheck, XCircle, Store, DollarSign, PieChart, MapPin
} from 'lucide-react';

// Simulasi Supabase Client (Untuk keperluan preview di Canvas)
// Di production, ganti dengan: import { createClient } from '@supabase/supabase-js'
const mockSupabase = {
  auth: {
    signInWithPassword: async ({ email, password }) => {
      if (password === 'password123') {
        return { data: { user: { id: 'user-1', email } }, error: null };
      }
      return { data: null, error: { message: 'Email atau password salah.' } };
    },
    signOut: async () => ({ error: null }),
    onAuthStateChange: (cb) => {
      // Mock session
      cb('SIGNED_OUT', null);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeEvent, setActiveEvent] = useState({ id: 1, name: 'AL ISLAM FESTIVAL 2027', year: 2027, status: 'Persiapan' });
  const [userRole, setUserRole] = useState('Koordinator Divisi'); // Mock role
  const [userDivision, setUserDivision] = useState('Acara & Lomba'); // Mock division
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const login = async (email, password) => {
    const { data, error } = await mockSupabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    // Di aplikasi nyata, kita akan fetch peran (role) dari tabel user_event_roles di sini
    if (email.includes('admin')) setUserRole('Super Admin');
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
      type={type} 
      onClick={onClick} 
      disabled={isLoading}
      className={`${baseStyle} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
  );
};

const LoginScreen = () => {
  const { login } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Al Islam Festival
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Masuk ke portal manajemen panitia
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="admin@alislam.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="password123"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={loading}>
              Masuk Sistem
            </Button>
            
            <div className="text-center text-xs text-slate-500 mt-4 flex flex-col gap-1">
              <span>Demo Admin: admin@alislam.org | password123</span>
              <span>Demo Panitia: panitia@alislam.org | password123</span>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

const Layout = ({ children, activePage, setActivePage }) => {
  const { userRole, userDivision, activeEvent, logout, isSidebarOpen, setIsSidebarOpen } = useContext(AppContext);

  // Navigasi dinamis berdasarkan PRD
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'pendaftaran', label: 'Pendaftaran & Peserta', icon: <Users size={20} /> },
    { id: 'checkin', label: 'Scan Check-in', icon: <Scan size={20} /> },
    { id: 'lomba', label: 'Manajemen Lomba', icon: <Trophy size={20} /> },
    { id: 'sponsor', label: 'Humas & Sponsor', icon: <Briefcase size={20} /> },
    { id: 'bazar', label: 'Bazar & Expo', icon: <Store size={20} /> },
  ];

  // Menu Keuangan hanya muncul jika perannya tepat (Sesuai keamanan PRD Tahap E)
  if (userRole === 'Super Admin' || userDivision === 'Keuangan') {
    navItems.push({ id: 'keuangan', label: 'Keuangan (RAB)', icon: <DollarSign size={20} /> });
  }

  if (userRole === 'Super Admin') {
    navItems.push({ id: 'pengaturan', label: 'Pengaturan Sistem', icon: <Settings size={20} /> });
  }

  const handleNavClick = (id) => {
    setActivePage(id);
    setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen w-72 bg-slate-900 text-white z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-lg">AL</div>
            <div>
              <h1 className="font-bold leading-tight">Al Islam<br/>Festival</h1>
            </div>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-800">
          <div className="bg-slate-800 p-3 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Event Aktif</p>
            <p className="font-semibold text-emerald-400 flex items-center gap-2">
              <Calendar size={16} /> {activeEvent.name}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activePage === item.id ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
               <Users size={18} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Pengguna Aktif</p>
              <p className="text-xs text-emerald-400 truncate">{userRole} • {userDivision}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-sm font-medium transition-colors">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 sm:px-6 justify-between lg:justify-end">
          <button className="lg:hidden text-slate-600" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Status Event: {activeEvent.status}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};

const RegistrationModule = () => {
  const [registrations, setRegistrations] = useState([
    { id: 'R001', school: 'SDIT Bina Insan', type: 'Futsal', category: 'SD', status: 'Menunggu Verifikasi', date: '08 Okt 2026', code: 'ALF-FS-001' },
    { id: 'R002', school: 'SMPN 1 Bandung', type: 'Pidato', category: 'SMP', status: 'Terverifikasi', date: '07 Okt 2026', code: 'ALF-PD-002' },
    { id: 'R003', school: 'SD Al Falah', type: 'MHQ', category: 'SD', status: 'Perlu Perbaikan', date: '09 Okt 2026', code: 'ALF-MQ-003' },
    { id: 'R004', school: 'SMP Nurul Fikri', type: 'Olimpiade MTK', category: 'SMP', status: 'Terverifikasi', date: '05 Okt 2026', code: 'ALF-OM-004' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleVerify = (id) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === id ? { ...reg, status: 'Terverifikasi' } : reg
    ));
  };

  const filteredData = registrations.filter(r => 
    r.school.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Terverifikasi': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Perlu Perbaikan': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pendaftaran & Peserta</h1>
          <p className="text-slate-600 mt-1">Verifikasi data sekolah, tim, dan kelengkapan berkas.</p>
        </div>
        <Button className="shrink-0"><Users size={18} /> Tambah Manual</Button>
      </div>

      <Card className="flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari sekolah atau kode pendaftaran..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm flex-1 sm:flex-none">
              <option>Semua Lomba</option>
              <option>Futsal</option>
              <option>Pidato</option>
              <option>MHQ</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                <th className="p-4 font-medium">Kode / Sekolah</th>
                <th className="p-4 font-medium">Lomba</th>
                <th className="p-4 font-medium">Tgl Daftar</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-slate-900">{reg.school}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{reg.code}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-700">{reg.type}</span>
                    <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{reg.category}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{reg.date}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusColor(reg.status)}`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {reg.status !== 'Terverifikasi' && (
                      <button 
                        onClick={() => handleVerify(reg.id)}
                        className="text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded font-medium transition-colors"
                      >
                        Verifikasi
                      </button>
                    )}
                    <button className="text-xs bg-slate-50 text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded font-medium transition-colors">
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    Tidak ada data pendaftaran ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const CheckInModule = () => {
  const [scanCode, setScanCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [checkedInList, setCheckedInList] = useState(['ALF-PD-002']); // Mock DB untuk yang sudah check-in

  // Mock valid database
  const validCodes = {
    'ALF-FS-001': { school: 'SDIT Bina Insan', type: 'Futsal', status: 'Menunggu Verifikasi' }, // Belum verif, harusnya ditolak
    'ALF-PD-002': { school: 'SMPN 1 Bandung', type: 'Pidato', status: 'Terverifikasi' },
    'ALF-OM-004': { school: 'SMP Nurul Fikri', type: 'Olimpiade MTK', status: 'Terverifikasi' },
  };

  const handleScan = (e) => {
    e.preventDefault();
    if (!scanCode.trim()) return;

    const code = scanCode.toUpperCase().trim();
    const data = validCodes[code];

    if (!data) {
      setScanResult({ type: 'error', message: 'Kode tidak ditemukan dalam sistem.' });
    } else if (data.status !== 'Terverifikasi') {
      setScanResult({ type: 'warning', message: `Pendaftaran ${data.school} belum diverifikasi!` });
    } else if (checkedInList.includes(code)) {
      // Pencegahan Check-in Ganda sesuai PRD
      setScanResult({ type: 'error', message: `Gagal! Peserta dari ${data.school} SUDAH check-in sebelumnya.` });
    } else {
      // Berhasil Check-in
      setCheckedInList(prev => [...prev, code]);
      setScanResult({ type: 'success', message: `Berhasil! ${data.school} (${data.type}) telah check-in.`, data });
    }
    
    setScanCode('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scanner Check-in</h1>
        <p className="text-slate-600 mt-1">Pindai QR Code atau masukkan kode unik peserta untuk kehadiran.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col items-center text-center justify-center min-h-[320px] bg-slate-900 text-white border-none relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent"></div>
          
          <QrCode className="w-24 h-24 text-emerald-400 mb-6 opacity-80" />
          <h2 className="text-xl font-bold mb-2 z-10">Siap Memindai</h2>
          <p className="text-sm text-slate-400 mb-8 z-10 max-w-xs">Arahkan kamera ke QR Code peserta atau ketik kode secara manual.</p>

          <form onSubmit={handleScan} className="w-full max-w-sm flex gap-2 z-10">
            <input 
              type="text" 
              placeholder="Contoh: ALF-OM-004" 
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
            />
            <Button type="submit" variant="primary" className="px-6">Cek</Button>
          </form>
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800">Status Pemindaian Terakhir</h3>
          
          {scanResult ? (
            <div className={`p-4 rounded-xl border ${
              scanResult.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
              scanResult.type === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-800' :
              'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-start gap-3">
                {scanResult.type === 'success' ? <UserCheck className="w-6 h-6 mt-0.5 text-emerald-600" /> : 
                 scanResult.type === 'warning' ? <AlertTriangle className="w-6 h-6 mt-0.5 text-orange-600" /> :
                 <XCircle className="w-6 h-6 mt-0.5 text-red-600" />}
                <div>
                  <p className="font-semibold">{scanResult.type === 'success' ? 'Check-in Valid' : 'Peringatan Sistem'}</p>
                  <p className="text-sm mt-1">{scanResult.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-center">
              <Scan className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Belum ada pemindaian baru.</p>
            </div>
          )}

          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-slate-700">Log Hari Ini</h4>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">{checkedInList.length} Peserta</span>
            </div>
            <div className="space-y-3">
              {checkedInList.map((code, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-slate-800">{validCodes[code]?.school}</p>
                    <p className="text-xs text-slate-500">{validCodes[code]?.type}</p>
                  </div>
                  <span className="text-xs text-slate-400">Baru saja</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CompetitionModule = () => {
  const [activeTab, setActiveTab] = useState('penilaian');
  const [publishStatus, setPublishStatus] = useState(false);

  // Mock data pendaftar untuk dinilai
  const [scores, setScores] = useState({
    materi: '',
    vokal: '',
    penampilan: ''
  });

  // Mock data hasil akhir (Leaderboard)
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'SMPN 1 Bandung', code: 'ALF-PD-002', score: 92.5, status: 'Pemenang' },
    { rank: 2, name: 'SMP IT Darul Quran', code: 'ALF-PD-015', score: 89.0, status: 'Finalis' },
    { rank: 3, name: 'MTsN 2 Kota', code: 'ALF-PD-008', score: 85.5, status: 'Finalis' },
  ]);

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    alert("Simulasi: Nilai berhasil disimpan sementara (Draft). Menunggu persetujuan Koordinator.");
  };

  const handlePublishToggle = () => {
    setPublishStatus(!publishStatus);
    // Di aplikasi nyata, ini akan memicu update ke tabel competition_results mengubah status menjadi 'Dipublikasikan'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Lomba & Penilaian</h1>
          <p className="text-slate-600 mt-1">Kelola rubrik, input skor juri, dan publikasi hasil (Pidato B. Indonesia).</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('penilaian')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'penilaian' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Form Penilaian Juri
        </button>
        <button 
          onClick={() => setActiveTab('hasil')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'hasil' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Rekap Hasil & Publikasi
        </button>
      </div>

      {activeTab === 'penilaian' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-5 lg:col-span-1 bg-slate-50">
            <h3 className="font-semibold text-slate-800 mb-4">Data Peserta Aktif</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Nomor Peserta</p>
                <p className="font-mono font-bold text-slate-900 text-lg">ALF-PD-002</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Asal Sekolah</p>
                <p className="font-medium text-slate-800">SMPN 1 Bandung</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Lomba</p>
                <span className="inline-block mt-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Pidato B. Indonesia</span>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Video/Karya Tersubmit</p>
                <Button variant="secondary" className="w-full text-sm py-1.5"><FileText size={16} /> Buka Berkas Lomba</Button>
              </div>
            </div>
          </Card>

          <Card className="p-5 lg:col-span-2">
            <h3 className="font-semibold text-slate-800 mb-4">Rubrik Penilaian Juri</h3>
            <form onSubmit={handleScoreSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Materi & Isi Pidato</label>
                  <p className="text-xs text-slate-500">Kesesuaian tema, kedalaman materi, sistematika (Bobot: 40%)</p>
                </div>
                <input type="number" min="0" max="100" required placeholder="0-100" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Vokal & Intonasi</label>
                  <p className="text-xs text-slate-500">Kejelasan suara, artikulasi, ketepatan nada (Bobot: 30%)</p>
                </div>
                <input type="number" min="0" max="100" required placeholder="0-100" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Penampilan & Gaya</label>
                  <p className="text-xs text-slate-500">Mimik wajah, gestur tubuh, adab berpakaian (Bobot: 30%)</p>
                </div>
                <input type="number" min="0" max="100" required placeholder="0-100" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
              </div>

              <div className="pt-4 border-t border-slate-200">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Catatan Tambahan (Opsional)</label>
                 <textarea rows="3" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="Ketik catatan konstruktif untuk peserta..."></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary">Kosongkan</Button>
                <Button type="submit">Simpan Draft Nilai</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {activeTab === 'hasil' && (
        <Card className="flex flex-col">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
            <div>
              <h3 className="font-semibold text-slate-800">Leaderboard Sementara</h3>
              <p className="text-sm text-slate-500">Hanya Super Admin & Ketua yang dapat mempublikasikan hasil ke publik.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${publishStatus ? 'text-emerald-600' : 'text-slate-500'}`}>
                {publishStatus ? 'Status: Publik (Live)' : 'Status: Internal (Draft)'}
              </span>
              <button 
                onClick={handlePublishToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${publishStatus ? 'bg-emerald-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${publishStatus ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                  <th className="p-4 font-medium w-16">Peringkat</th>
                  <th className="p-4 font-medium">Peserta / Sekolah</th>
                  <th className="p-4 font-medium text-center">Skor Akhir</th>
                  <th className="p-4 font-medium text-right">Keputusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {leaderboard.map((item, idx) => (
                  <tr key={idx} className={idx === 0 ? 'bg-yellow-50/50' : ''}>
                    <td className="p-4 text-center font-bold text-slate-700">#{item.rank}</td>
                    <td className="p-4">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{item.code}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 bg-slate-100 rounded-lg font-bold text-slate-800">{item.score}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${item.status === 'Pemenang' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

const SponsorModule = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  
  const sponsors = [
    { id: 1, name: 'Bank Syariah Indonesia (BSI)', type: 'Instansi / BUMN', package: 'Gold', status: 'Deal', value: 'Rp 10.000.000', pic: 'Bpk. Ahmad' },
    { id: 2, name: 'Penerbit Erlangga', type: 'Perusahaan', package: 'Silver', status: 'Negosiasi', value: 'Rp 5.000.000', pic: 'Ibu Rina' },
    { id: 3, name: 'Toko Olahraga Jaya', type: 'UMKM', package: 'Custom (Barang)', status: 'Proposal Dikirim', value: 'Bola & Rompi', pic: 'Bpk. Budi' },
    { id: 4, name: 'Klinik Sehat', type: 'Kesehatan', package: 'Bronze', status: 'Selesai', value: 'P3K + Obat', pic: 'dr. Sarah' },
  ];

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Deal': return 'bg-emerald-100 text-emerald-700';
      case 'Selesai': return 'bg-blue-100 text-blue-700';
      case 'Negosiasi': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Humas & Sponsorship</h1>
          <p className="text-slate-600 mt-1">Kelola relasi eksternal, pipeline donatur, dan status benefit sponsor.</p>
        </div>
        <Button className="shrink-0"><Briefcase size={18} /> Tambah Relasi</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-emerald-500">
          <p className="text-sm text-slate-500">Total Deals Tercapai</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">Rp 15.000.000</h3>
        </Card>
        <Card className="p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-slate-500">Potongan Negosiasi</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">Rp 5.000.000</h3>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <p className="text-sm text-slate-500">Total Relasi Dihubungi</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">12 Instansi</h3>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Pipeline Relasi (CRM)</h3>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
             <input type="text" placeholder="Cari donatur..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-emerald-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500 bg-white">
                <th className="p-4 font-medium">Mitra / Instansi</th>
                <th className="p-4 font-medium">Paket / Kontribusi</th>
                <th className="p-4 font-medium">Nilai Estimasi</th>
                <th className="p-4 font-medium">Status Pipeline</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sponsors.map(sponsor => (
                <tr key={sponsor.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <p className="font-medium text-slate-900">{sponsor.name}</p>
                    <p className="text-xs text-slate-500">{sponsor.type} • PIC: {sponsor.pic}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-700 font-medium">{sponsor.package}</td>
                  <td className="p-4 text-sm text-slate-600">{sponsor.value}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusStyle(sponsor.status)}`}>
                      {sponsor.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const BazarModule = () => {
  const tenants = [
    { id: 1, name: 'Kedai Kopi Santri', type: 'Bazar UMKM', pic: 'Kang Asep', booth: 'A-01', payment: 'Lunas' },
    { id: 2, name: 'Penerbit Mizan', type: 'Bazar Buku', pic: 'Bpk. Fajar', booth: 'B-01', payment: 'Lunas' },
    { id: 3, name: 'Ayam Geprek Dahsyat', type: 'Bazar UMKM', pic: 'Ibu Ningsih', booth: 'A-02', payment: 'DP 50%' },
    { id: 4, name: 'Gamis Collection', type: 'Bazar UMKM', pic: 'Mbak Tari', booth: '-', payment: 'Menunggu Verifikasi' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bazar UMKM & Expo Karya</h1>
          <p className="text-slate-600 mt-1">Manajemen tenant bazar UMKM, bazar buku, dan penetapan nomor booth lapak.</p>
        </div>
        <Button className="shrink-0"><Store size={18} /> Pendaftaran Tenant</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
              <select className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm">
                <option>Semua Kategori</option>
                <option>Bazar UMKM</option>
                <option>Bazar Buku</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500 bg-white">
                    <th className="p-4 font-medium">Nama Usaha / Tenant</th>
                    <th className="p-4 font-medium">Kategori</th>
                    <th className="p-4 font-medium text-center">No. Booth</th>
                    <th className="p-4 font-medium">Status Pembayaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {tenants.map(tenant => (
                    <tr key={tenant.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-medium text-slate-900">{tenant.name}</p>
                        <p className="text-xs text-slate-500">PIC: {tenant.pic}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-600">{tenant.type}</td>
                      <td className="p-4 text-center">
                        {tenant.booth !== '-' ? (
                          <span className="inline-block px-2 py-1 bg-slate-800 text-white rounded text-xs font-bold">{tenant.booth}</span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Belum diset</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          tenant.payment === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 
                          tenant.payment === 'DP 50%' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {tenant.payment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Info Panen Karya Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-5 bg-emerald-50 border-emerald-100">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2 mb-2"><MapPin size={18} /> Denah Lapangan</h3>
            <p className="text-sm text-emerald-700 mb-4">Pemetaan tata letak booth bazar dan panggung pameran (Panen Karya).</p>
            <Button variant="primary" className="w-full text-sm bg-emerald-700 hover:bg-emerald-800">Lihat Denah</Button>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-slate-800 mb-2">Expo Panen Karya</h3>
            <p className="text-sm text-slate-600 mb-4">Galeri pameran hasil karya santri SMP/SMA yang telah disetujui kurator.</p>
            <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
              <span className="text-slate-500">Karya Disetujui</span>
              <span className="font-bold text-slate-800">45 Item</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const FinanceModule = () => {
  const { userRole, userDivision } = useContext(AppContext);

  // Proteksi Keamanan Ganda (Double-check di UI, walau di RLS DB sudah ada)
  if (userRole !== 'Super Admin' && userDivision !== 'Keuangan') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 mt-20">
        <AlertTriangle className="w-16 h-16 mb-4 text-red-400" />
        <h2 className="text-xl font-bold text-slate-800">Akses Ditolak</h2>
        <p className="text-sm mt-2 text-center max-w-md">Modul keuangan bersifat Rahasia. Hanya akun dengan penugasan divisi "Keuangan" atau "Super Admin" yang berhak mengakses halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Keuangan & RAB</h1>
          <p className="text-slate-600 mt-1">Rencana Anggaran Biaya, realisasi, dan pencatatan kas keluar-masuk.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="secondary" className="shrink-0 text-sm"><FileText size={16} /> Export Laporan</Button>
           <Button variant="primary" className="shrink-0 text-sm"><DollarSign size={16} /> Catat Transaksi</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 flex items-center justify-between bg-emerald-50 border-emerald-100">
          <div>
            <p className="text-sm font-medium text-emerald-800 mb-1">Total Pemasukan (Dana & Sponsor)</p>
            <h2 className="text-3xl font-bold text-emerald-600">Rp 25.500.000</h2>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700">
            <DollarSign size={24} />
          </div>
        </Card>
        <Card className="p-5 flex items-center justify-between bg-red-50 border-red-100">
          <div>
            <p className="text-sm font-medium text-red-800 mb-1">Total Pengeluaran (Realisasi)</p>
            <h2 className="text-3xl font-bold text-red-600">Rp 8.200.000</h2>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center text-red-700">
            <PieChart size={24} />
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Riwayat Transaksi & Pengajuan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500 bg-white">
                <th className="p-4 font-medium">Tanggal</th>
                <th className="p-4 font-medium">Keterangan / Divisi</th>
                <th className="p-4 font-medium">Jenis</th>
                <th className="p-4 font-medium text-right">Nominal (Rp)</th>
                <th className="p-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr className="hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-600">01 Nov 2026</td>
                <td className="p-4">
                  <p className="font-medium text-slate-900">DP Panggung Utama & Sound System</p>
                  <p className="text-xs text-slate-500">Div. Sarana & Operasional</p>
                </td>
                <td className="p-4"><span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Pengeluaran</span></td>
                <td className="p-4 text-right font-medium text-slate-800">5.000.000</td>
                <td className="p-4 text-center"><span className="text-xs text-slate-500">Dicairkan</span></td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-600">03 Nov 2026</td>
                <td className="p-4">
                  <p className="font-medium text-slate-900">Pencairan Dana Sponsor BSI</p>
                  <p className="text-xs text-slate-500">Div. Humas & Sponsor</p>
                </td>
                <td className="p-4"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Pemasukan</span></td>
                <td className="p-4 text-right font-medium text-slate-800">10.000.000</td>
                <td className="p-4 text-center"><span className="text-xs text-emerald-600 font-medium">Diterima</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const AppContent = () => {
  const { user } = useContext(AppContext);
  const [activePage, setActivePage] = useState('dashboard');
  
  if (!user) {
    return <LoginScreen />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'pendaftaran': return <RegistrationModule />;
      case 'checkin': return <CheckInModule />;
      case 'lomba': return <CompetitionModule />;
      case 'sponsor': return <SponsorModule />;
      case 'bazar': return <BazarModule />;
      case 'keuangan': return <FinanceModule />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 mt-20">
          <Settings className="w-12 h-12 mb-4 opacity-20" />
          <h2 className="text-xl font-semibold">Modul dalam pengembangan</h2>
          <p className="text-sm mt-2 text-center max-w-md">Sesuai prioritas PRD, modul "{activePage}" akan diaktifkan pada tahap implementasi selanjutnya.</p>
        </div>
      );
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
