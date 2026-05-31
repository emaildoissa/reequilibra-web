import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const navItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/leads', label: 'Leads', icon: 'group' },
    { path: '/pipeline', label: 'Pipeline', icon: 'view_kanban' },
    { path: '/calendar', label: 'Calendário', icon: 'calendar_month' },
    { path: '/tasks', label: 'Tarefas', icon: 'event_note' },
    { path: '/analytics', label: 'Analytics', icon: 'analytics' },
];

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const user = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')!) 
        : null;

    const handleLogout = async () => {
        try {
            await apiFetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
            // Continue even if API call fails
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#635bff]/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[#09090b]" />
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#12121a]/90 backdrop-blur-xl border-b border-[#2a2a35] z-50 flex items-center justify-between px-4">
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-[#2a2a35]"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#635bff] to-violet-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">bolt</span>
                    </div>
                    <span className="font-bold text-gradient">Reequilibra</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-[#2a2a35]">
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Sidebar - Desktop */}
            <aside className={`hidden lg:flex ${sidebarOpen ? 'w-64' : 'w-20'} flex-col fixed left-0 top-0 h-screen bg-[#12121a]/80 backdrop-blur-xl border-r border-[#2a2a35] transition-all duration-300 z-40`}>
                <div className="h-14 flex items-center justify-between px-4 border-b border-[#2a2a35]">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#635bff] to-violet-600 flex items-center justify-center shadow-glow shrink-0">
                            <span className="material-symbols-outlined text-white text-lg">bolt</span>
                        </div>
                        {sidebarOpen && (
                            <span className="text-lg font-bold text-gradient">Reequilibra</span>
                        )}
                    </Link>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-[#2a2a35] transition-all"
                    >
                        <span className="material-symbols-outlined text-xl">
                            {sidebarOpen ? 'chevron_left' : 'chevron_right'}
                        </span>
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || 
                            (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                                    isActive 
                                        ? 'bg-[#635bff]/10 text-[#6366f1]' 
                                        : 'text-zinc-500 hover:text-white hover:bg-[#2a2a35]'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-[#6366f1]' : 'text-zinc-500 group-hover:text-white'}`}>
                                    {item.icon}
                                </span>
                                {sidebarOpen && (
                                    <span className="font-medium text-sm">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#2a2a35]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#635bff] to-violet-600 flex items-center justify-center font-bold text-white shrink-0">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{user?.name || 'Usuário'}</p>
                                <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                    {sidebarOpen && (
                        <button onClick={handleLogout} className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                            <span className="material-symbols-outlined text-lg">logout</span>
                            <span className="text-sm">Sair</span>
                        </button>
                    )}
                </div>
            </aside>

            {/* Mobile Navigation */}
            <nav className={`lg:hidden fixed bottom-0 left-0 right-0 bg-[#12121a]/90 backdrop-blur-xl border-t border-[#2a2a35] z-40`}>
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.slice(0, 5).map((item) => {
                        const isActive = location.pathname === item.path || 
                            (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                                    isActive ? 'text-[#6366f1] bg-[#635bff]/10' : 'text-zinc-500'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} pt-14 lg:pt-0 pb-20 lg:pb-0`}>
                {/* Desktop Header */}
                <header className="hidden lg:flex h-16 items-center justify-between px-6 border-b border-[#2a2a35] bg-[#12121a]/50 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold">
                            {navItems.find(n => location.pathname === n.path || (n.path !== '/' && location.pathname.startsWith(n.path)))?.label || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-xl bg-[#2a2a35] text-zinc-400 hover:text-white transition-all relative">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <button className="p-2.5 rounded-xl bg-[#2a2a35] text-zinc-400 hover:text-white transition-all relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 lg:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}