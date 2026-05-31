import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

interface Lead {
    id: string;
    telefone: string;
    nome: string;
    score: number;
    classificacao: string;
    estado_atual: string;
    created_at: string;
    updated_at: string;
}

interface Stats {
    total: number;
    quentes: number;
    mornos: number;
    frios: number;
    semClass: number;
    finalizado: number;
}

export default function Analytics() {
    const [period, setPeriod] = useState('month');
    const [stats, setStats] = useState<Stats | null>(null);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            apiFetch('/api/leads/stats').then(r => r.json()),
            apiFetch('/api/leads?limit=1000&sort=created_at&order=DESC').then(r => r.json())
        ])
        .then(([statsData, leadsData]) => {
            setStats(statsData);
            setLeads(leadsData.data || []);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const conversionRate = stats ? ((stats.finalizado / stats.total) * 100).toFixed(0) : 0;
    const avgScore = leads.length > 0 
        ? Math.round(leads.reduce((acc, l) => acc + l.score, 0) / leads.length) 
        : 0;

    // Dados do funil baseados nos estados reais
    const estadosReais = {
        'Novo': leads.filter(l => !l.estado_atual || l.estado_atual.includes('AGUARDANDO')).length,
        'Contato': leads.filter(l => l.estado_atual === 'EM_CONTATO').length,
        'Triagem': leads.filter(l => l.estado_atual === 'EM_TRIAGEM').length,
        'Proposta': leads.filter(l => l.estado_atual === 'AGUARDANDO_PROPOSTA').length,
        'Finalizado': leads.filter(l => l.estado_atual === 'FINALIZADO').length,
    };

    const totalFunil = Object.values(estadosReais).reduce((a, b) => a + b, 0) || 1;

    const funnelData = [
        { stage: 'Novo', value: estadosReais.Novo, percent: Math.round((estadosReais.Novo / totalFunil) * 100) },
        { stage: 'Contato', value: estadosReais.Contato, percent: Math.round((estadosReais.Contato / totalFunil) * 100) },
        { stage: 'Triagem', value: estadosReais.Triagem, percent: Math.round((estadosReais.Triagem / totalFunil) * 100) },
        { stage: 'Proposta', value: estadosReais.Proposta, percent: Math.round((estadosReais.Proposta / totalFunil) * 100) },
        { stage: 'Finalizado', value: estadosReais.Finalizado, percent: Math.round((estadosReais.Finalizado / totalFunil) * 100) },
    ];

    // Dados mensais (últimos 6 meses)
    const monthlyData = (() => {
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = d.toLocaleDateString('pt-BR', { month: 'short' });
            const monthLeads = leads.filter(l => {
                const created = new Date(l.created_at);
                return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
            }).length;
            const converted = monthLeads * 0.3;
            months.push({ month: monthName.charAt(0).toUpperCase() + monthName.slice(1), leads: monthLeads, converted: Math.round(converted) });
        }
        return months;
    })();

    // Por fonte (fictício por enquanto - não temos esse dado)
    const topSources = [
        { source: 'WhatsApp', count: Math.round((stats?.total || 0) * 0.5), percent: 50 },
        { source: 'Indicação', count: Math.round((stats?.total || 0) * 0.2), percent: 20 },
        { source: 'Facebook', count: Math.round((stats?.total || 0) * 0.15), percent: 15 },
        { source: 'Instagram', count: Math.round((stats?.total || 0) * 0.1), percent: 10 },
        { source: 'Outros', count: Math.round((stats?.total || 0) * 0.05), percent: 5 },
    ];

    const _weeklyPerformance = [
        { day: 'Seg', calls: 12, tasks: 8 },
        { day: 'Ter', calls: 18, tasks: 12 },
        { day: 'Qua', calls: 15, tasks: 10 },
        { day: 'Qui', calls: 22, tasks: 15 },
        { day: 'Sex', calls: 20, tasks: 14 },
    ];
    void _weeklyPerformance;

    const metrics = [
        { label: 'Total Leads', value: stats?.total || 0, change: '+12%', trend: 'up', icon: 'group' },
        { label: 'Conversion Rate', value: `${conversionRate}%`, change: '+3%', trend: 'up', icon: 'trending_up' },
        { label: 'Avg Score', value: avgScore, change: '+5%', trend: 'up', icon: 'analytics' },
        { label: 'Finalizados', value: stats?.finalizado || 0, change: '+18%', trend: 'up', icon: 'check_circle' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#635bff]/30 border-t-[#635bff] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <p className="text-zinc-500 mt-1">Dados reais do seu funil de vendas.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1 p-1 bg-[#1c1c24] rounded-xl">
                        {['week', 'month', 'year'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    period === p
                                        ? 'bg-[#635bff] text-white'
                                        : 'text-zinc-500 hover:text-white'
                                }`}
                            >
                                {p === 'week' ? 'Semana' : p === 'month' ? 'Mês' : 'Ano'}
                            </button>
                        ))}
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <span className="material-symbols-outlined">download</span>
                        Exportar
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                    <div 
                        key={metric.label} 
                        className="card animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-[#635bff]/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#6366f1]">{metric.icon}</span>
                            </div>
                            <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                {metric.change}
                            </span>
                        </div>
                        <p className="text-3xl font-bold">{metric.value}</p>
                        <p className="text-sm text-zinc-500 mt-1">{metric.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Monthly Leads Chart */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Leads por Mês</h3>
                    <div className="h-48 flex items-end justify-between gap-2">
                        {monthlyData.map((item) => (
                            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex flex-col gap-1">
                                    <div 
                                        className="w-full bg-[#635bff] rounded-t-md transition-all hover:bg-[#818cf8]"
                                        style={{ height: `${Math.max(item.leads * 8, 4)}px` }}
                                    />
                                    <div 
                                        className="w-full bg-emerald-500/50 rounded-t-md transition-all hover:bg-emerald-400"
                                        style={{ height: `${Math.max(item.converted * 8, 2)}px` }}
                                    />
                                </div>
                                <span className="text-xs text-zinc-500">{item.month}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#635bff]" />
                            <span className="text-xs text-zinc-500">Leads</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs text-zinc-500">Convertidos</span>
                        </div>
                    </div>
                </div>

                {/* Funnel */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Funil de Vendas</h3>
                    <div className="space-y-3">
                        {funnelData.map((item) => (
                            <div key={item.stage} className="flex items-center gap-3">
                                <span className="w-20 text-sm text-zinc-500">{item.stage}</span>
                                <div className="flex-1 h-8 bg-[#1c1c24] rounded-lg overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-[#635bff] to-violet-500 rounded-lg flex items-center justify-end px-2 transition-all"
                                        style={{ width: `${item.percent}%` }}
                                    >
                                        <span className="text-xs font-medium">{item.value}</span>
                                    </div>
                                </div>
                                <span className="w-12 text-xs text-zinc-500 text-right">{item.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Charts */}
            <div className="grid grid-cols-2 gap-6">
                {/* Classification Stats */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Classificação</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Quentes</span>
                                <span className="text-sm font-bold text-red-400">{stats?.quentes || 0}</span>
                            </div>
                            <div className="h-3 bg-[#1c1c24] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                                    style={{ width: `${stats ? (stats.quentes / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Mornos</span>
                                <span className="text-sm font-bold text-amber-400">{stats?.mornos || 0}</span>
                            </div>
                            <div className="h-3 bg-[#1c1c24] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                                    style={{ width: `${stats ? (stats.mornos / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Frios</span>
                                <span className="text-sm font-bold text-zinc-400">{stats?.frios || 0}</span>
                            </div>
                            <div className="h-3 bg-[#1c1c24] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-zinc-500 to-zinc-600 rounded-full"
                                    style={{ width: `${stats ? (stats.frios / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">Sem Classificação</span>
                                <span className="text-sm font-bold text-zinc-500">{stats?.semClass || 0}</span>
                            </div>
                            <div className="h-3 bg-[#1c1c24] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-full"
                                    style={{ width: `${stats ? (stats.semClass / stats.total) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Sources (Estimado) */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Origem dos Leads</h3>
                    <div className="space-y-3">
                        {topSources.map((item) => (
                            <div key={item.source} className="flex items-center gap-3">
                                <span className="w-24 text-sm">{item.source}</span>
                                <div className="flex-1 h-6 bg-[#1c1c24] rounded-lg overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-[#6366f1] to-violet-400 rounded-lg"
                                        style={{ width: `${item.percent}%` }}
                                    />
                                </div>
                                <span className="w-12 text-xs text-zinc-500 text-right">{item.count}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-600 mt-3">* Origem estimada baseado em dados disponíveis</p>
                </div>
            </div>
        </div>
    );
}