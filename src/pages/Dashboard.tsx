import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

interface Lead {
    id: string;
    telefone: string;
    nome: string;
    score: number;
    classificacao: string;
    estado_atual: string;
    updated_at: string;
}

interface Stats {
    total: number;
    quentes: number;
    mornos: number;
    frios: number;
    semClass: number;
    triagem: number;
    proposta: number;
    finalizado: number;
}

export default function Dashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        Promise.all([
            apiFetch('/api/leads?limit=5&sort=updated_at&order=DESC').then(r => r.json()),
            apiFetch('/api/leads/stats').then(r => r.json())
        ])
        .then(([leadsData, statsData]) => {
            setLeads(leadsData.data || []);
            setStats(statsData);
        })
        .catch(err => console.error('Error:', err))
        .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#635bff]/30 border-t-[#635bff] rounded-full animate-spin" />
            </div>
        );
    }



    const qualityCards = [
        { label: 'Total Geral de Leads', value: stats?.total ?? 0, change: 'Total no CRM', trend: 'none', icon: 'group', color: '#8b5cf6' },
        { label: 'Leads Quentes', value: stats?.quentes ?? 0, change: 'Alto Potencial', trend: 'none', icon: 'whatshot', color: '#ef4444' },
        { label: 'Leads Mornos', value: stats?.mornos ?? 0, change: 'Médio Potencial', trend: 'none', icon: 'thermostat', color: '#f97316' },
        { label: 'Leads Frios', value: stats?.frios ?? 0, change: 'Baixo Potencial', trend: 'none', icon: 'ac_unit', color: '#06b6d4' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Olá, Marcos 
                        <span className="animate-bounce">👋</span>
                    </h1>
                    <p className="text-zinc-500 mt-1">Aqui está o acompanhamento unificado dos seus funis de vendas.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 hidden sm:inline">Última atualização: {new Date().toLocaleTimeString('pt-BR')}</span>
                    <button 
                        onClick={() => window.location.reload()}
                        className="btn-secondary p-2 flex items-center justify-center rounded-xl hover:border-[#635bff]/40 transition-all bg-[#1c1c24] border border-[#2a2a35]"
                        title="Atualizar Dados"
                    >
                        <span className="material-symbols-outlined text-sm text-zinc-400">refresh</span>
                    </button>
                    <Link 
                        to="/pipeline" 
                        className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3 rounded-xl shadow-glow bg-[#635bff] text-white hover:bg-[#5249f0] transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">view_kanban</span>
                        Abrir Kanban
                    </Link>
                </div>
            </div>

            {/* Visual Funnel Pipelines */}
            <div className="card bg-gradient-to-br from-[#1c1c24] to-[#14141d] border border-[#2a2a35] p-6 rounded-2xl animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#635bff]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#635bff]">filter_alt</span>
                    Visualização Dinâmica do Funil de Vendas
                </h3>
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 relative z-10">
                    {/* Stage 1: Triagem */}
                    <div className="w-full lg:flex-1 flex flex-col p-5 rounded-2xl bg-[#1c1c24]/50 border border-[#2a2a35] hover:border-[#6366f1]/30 transition-all text-center relative group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#6366f1] rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/15 flex items-center justify-center mx-auto mb-3 text-[#6366f1] transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-2xl">chat</span>
                        </div>
                        <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">1. Triagem (WhatsApp)</span>
                        <span className="text-4xl font-black text-zinc-100 mt-2">{stats?.triagem ?? 0}</span>
                        <span className="text-[10px] text-zinc-500 mt-1 font-medium">Contatos em qualificação</span>
                    </div>

                    {/* Arrow 1 */}
                    <div className="flex lg:flex-col justify-center items-center py-2 lg:py-0 px-2 text-zinc-500 gap-2">
                        <div className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xl text-[#635bff] animate-pulse">double_arrow</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-extrabold text-[#6366f1] bg-[#6366f1]/10 border border-[#6366f1]/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                                {stats?.total ? ((( (stats.proposta + stats.finalizado) / stats.total) * 100).toFixed(0)) : '0'}% Avanço
                            </span>
                        </div>
                    </div>

                    {/* Stage 2: Proposta */}
                    <div className="w-full lg:flex-1 flex flex-col p-5 rounded-2xl bg-[#1c1c24]/50 border border-[#2a2a35] hover:border-[#f59e0b]/30 transition-all text-center relative group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#f59e0b] rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-2xl bg-[#f59e0b]/15 flex items-center justify-center mx-auto mb-3 text-[#f59e0b] transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-2xl">description</span>
                        </div>
                        <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">2. Proposta Enviada</span>
                        <span className="text-4xl font-black text-zinc-100 mt-2">{stats?.proposta ?? 0}</span>
                        <span className="text-[10px] text-zinc-500 mt-1 font-medium">Análise de diagnóstico</span>
                    </div>

                    {/* Arrow 2 */}
                    <div className="flex lg:flex-col justify-center items-center py-2 lg:py-0 px-2 text-zinc-500 gap-2">
                        <div className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xl text-[#f472b6] animate-pulse">double_arrow</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-extrabold text-[#f472b6] bg-[#f472b6]/10 border border-[#f472b6]/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                                {(stats?.proposta || stats?.finalizado) ? (((stats.finalizado / (stats.proposta + stats.finalizado)) * 100).toFixed(0)) : '0'}% Fechamento
                            </span>
                        </div>
                    </div>

                    {/* Stage 3: Fechado */}
                    <div className="w-full lg:flex-1 flex flex-col p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all text-center relative group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500/80 rounded-t-2xl opacity-100" />
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-emerald-400 transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-2xl">payments</span>
                        </div>
                        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">3. Faturamento Fechado</span>
                        <span className="text-4xl font-black text-emerald-400 mt-2">{stats?.finalizado ?? 0}</span>
                        <span className="text-[10px] text-emerald-500/70 mt-1 font-medium">Clientes Ativos</span>
                    </div>
                </div>
            </div>

            {/* Quality Section */}
            <div className="space-y-3 pt-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Distribuição e Qualificação de Leads</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {qualityCards.map((card) => (
                        <div 
                            key={card.label} 
                            className="card group hover:border-[#635bff]/20 animate-slide-up"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-zinc-400 text-sm">{card.label}</span>
                                <span 
                                    className="material-symbols-outlined transition-colors text-zinc-500 group-hover:text-zinc-300"
                                    style={{ color: card.value > 0 ? card.color : undefined }}
                                >
                                    {card.icon}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-zinc-100">{card.value}</div>
                            <div className="text-xs mt-1 text-zinc-500">
                                {card.change}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-zinc-400">history</span>
                        Leads Recentes
                    </h2>
                    {leads.length === 0 ? (
                        <p className="text-zinc-500">Nenhum lead encontrado</p>
                    ) : (
                        <div className="space-y-2">
                            {leads.map((lead: Lead) => (
                                <div
                                    key={lead.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-[#1c1c24] hover:bg-[#252529] transition-all group border border-transparent hover:border-[#635bff]/10"
                                >
                                    <Link to={`/lead/${lead.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className={`avatar ${
                                            lead.classificacao === 'QUENTE' ? 'bg-red-500/20 text-red-400' :
                                            lead.classificacao === 'MORNO' ? 'bg-orange-500/20 text-orange-400' :
                                            lead.classificacao === 'FRIO' ? 'bg-cyan-500/20 text-cyan-400' :
                                            'bg-zinc-500/20 text-zinc-400'
                                        }`}>
                                            {(lead.nome || '?')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-zinc-200 truncate group-hover:text-[#635bff] transition-colors">{lead.nome || 'Sem nome'}</p>
                                                {lead.classificacao && (
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                                                        lead.classificacao === 'QUENTE' ? 'bg-red-500/10 text-red-400' :
                                                        lead.classificacao === 'MORNO' ? 'bg-orange-500/10 text-orange-400' :
                                                        'bg-cyan-500/10 text-cyan-400'
                                                    }`}>
                                                        {lead.classificacao}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500 truncate mt-0.5 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#635bff]"></span>
                                                {lead.estado_atual.replace('AGUARDANDO_', 'Etapa ').replace('EM_', 'Em ')}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <a 
                                            href={`https://wa.me/${lead.telefone}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-all"
                                            title="Conversar no WhatsApp"
                                        >
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                        </a>
                                        <Link 
                                            to={`/lead/${lead.id}`}
                                            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-all animate-fade-in"
                                        >
                                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-zinc-400">pie_chart</span>
                        Distribuição por Qualidade
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-400">Quentes</span>
                                <span className="text-red-400 font-semibold">{stats?.quentes || 0}</span>
                            </div>
                            <div className="h-2 bg-[#2a2a35] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-red-500 rounded-full" 
                                    style={{ width: `${stats?.total ? (stats.quentes / stats.total * 100) : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-400">Mornos</span>
                                <span className="text-orange-400 font-semibold">{stats?.mornos || 0}</span>
                            </div>
                            <div className="h-2 bg-[#2a2a35] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-orange-500 rounded-full" 
                                    style={{ width: `${stats?.total ? (stats.mornos / stats.total * 100) : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-400">Frios</span>
                                <span className="text-cyan-400 font-semibold">{stats?.frios || 0}</span>
                            </div>
                            <div className="h-2 bg-[#2a2a35] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-cyan-500 rounded-full" 
                                    style={{ width: `${stats?.total ? (stats.frios / stats.total * 100) : 0}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-400">Sem classificação</span>
                                <span className="text-zinc-500 font-semibold">{stats?.semClass || 0}</span>
                            </div>
                            <div className="h-2 bg-[#2a2a35] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-zinc-500 rounded-full" 
                                    style={{ width: `${stats?.total ? (stats.semClass / stats.total * 100) : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}