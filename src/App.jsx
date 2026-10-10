import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Menu, X, Home, Users, Calendar, Trophy, 
  Settings, LogOut, CheckCircle, Clock, AlertTriangle, Briefcase, FileText,
  QrCode, Scan, Search, UserCheck, XCircle, Store, DollarSign, PieChart, MapPin
} from 'lucide-react';

// Simulasi Supabase Client
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
      cb('SIGNED_OUT', null);
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeEvent, setActiveEvent] = useState({ id: 1, name: 'AL ISLAM FESTIVAL 2027', year: 2027, status: 'Persiapan' });
  const [userRole, setUserRole] = useState('Koordinator Divisi');
  const [userDivision, setUserDivision] = useState('Acara & Lomba');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const login = async (email, password) => {
    const { data, error } = await mockSupabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    if (email.includes('admin')) setUserRole('Super Admin');
    else setUserRole('Koordinator Divisi');
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Al Islam Festival</h2>
        <p className="mt-2 text-center text-sm text-slate-600">Masuk ke portal manajemen panitia</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="admin@alislam.org" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="password123" />
            </div>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2"><AlertTriangle className="w-5 h-5 flex-shrink-0" /><p>{error}</p></div>}
            <Button type="submit" className="w-full" isLoading={loading}>Masuk Sistem</Button>
            <div className="text-center text-xs text-slate-500 mt-4 flex flex-col gap-1">
              <span>Admin: admin@alislam.org | password123</span>
              <span>Panitia: panitia@alislam.org | password123</span>
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
              <p className="text-sm font-medium truncate">Pengguna Aktif</p>
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
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Dashboard Utama</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <h3 className="text-slate-500 text-sm font-medium">Pendaftar Terverifikasi</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">89</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-slate-500 text-sm font-medium">Total Relasi Sponsor</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">12</p>
      </Card>
      <Card className="p-6">
        <h3 className="text-slate-500 text-sm font-medium">Tenant Bazar</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">4</p>
      </Card>
    </div>
  </div>
);

const AppContent = () => {
  const { user } = useContext(AppContext);
  const [activePage, setActivePage] = useState('dashboard');
  if (!user) return <LoginScreen />;
  
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 mt-20">
          <Settings className="w-12 h-12 mb-4 opacity-20" />
          <h2 className="text-xl font-semibold">Modul {activePage} aktif!</h2>
          <p className="text-sm mt-2 text-center">Tampilan admin gelap dan menu lengkap berhasil dimuat.</p>
        </div>
      );
    }
  };
  return <Layout activePage={activePage} setActivePage={setActivePage}>{renderPage()}</Layout>;
};

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}