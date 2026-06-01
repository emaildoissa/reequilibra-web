import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.erro || 'Erro ao fazer login');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError('Erro de conexão. Verifique se a API está rodando.');
            setLoading(false);
        }
    };

    const isLoggedIn = localStorage.getItem('token');
    if (isLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#635bff]/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#635bff] to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-glow">
                        <span className="material-symbols-outlined text-white text-3xl">bolt</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gradient">Reequilibra</h1>
                    <p className="text-zinc-500 mt-2">CRM Financeiro</p>
                </div>

                <div className="card">
                    <h2 className="text-xl font-bold text-center mb-6">Entrar</h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-zinc-500">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm text-zinc-500">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-[#2a2a35] text-center">
                        <p className="text-xs text-zinc-600">
                            Credenciais: admin@reequilibra / admin123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}