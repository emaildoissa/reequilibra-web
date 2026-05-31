import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { getLabel, DIFICULDADE_FINANCEIRA, TIPO_DIVIDA, RENDA_COMPROMETIDA, FONTE_RENDA, ATRASO_NEGATIVACAO } from '../utils/labels';

interface Lead {
    id: string;
    telefone: string;
    nome: string;
    cpf?: string;
    email?: string;
    cidade_estado?: string;
    score: number;
    classificacao: string;
    estado_atual: string;
    dificuldade_financeira: string;
    renda_comprometida: string;
    tipo_divida: string;
    fonte_renda: string;
    atraso_negativacao: string;
    updated_at: string;
    dados_lead?: string;
}

const getFormCategories = (formulario: Record<string, any>) => {
    const categories: { [key: string]: { title: string; icon: string; fields: [string, any][] } } = {
        cadastro: { title: '1. Informações Cadastrais (2.x)', icon: 'person', fields: [] },
        renda: { title: '2. Renda e Ocupação (3.x)', icon: 'payments', fields: [] },
        despesas: { title: '3. Despesas Básicas (4.x)', icon: 'shopping_cart', fields: [] },
        dividas: { title: '4. Dívidas e Financiamentos (5.x a 13.x)', icon: 'account_balance', fields: [] },
        negativacoes: { title: '5. Negativações e Cobranças (14.x)', icon: 'warning', fields: [] },
        habitos: { title: '6. Hábitos e Reservas (15.x)', icon: 'trending_up', fields: [] },
        objetivos: { title: '7. Objetivos e Documentos (16.x / 17.x)', icon: 'flag', fields: [] },
        outros: { title: 'Outros Dados', icon: 'article', fields: [] }
    };

    // Ordenar as chaves para que fiquem organizadas numericamente
    const sortedKeys = Object.keys(formulario).sort((a, b) => {
        const numA = parseFloat(a.match(/^\d+(\.\d+)?/)?.[0] || '999');
        const numB = parseFloat(b.match(/^\d+(\.\d+)?/)?.[0] || '999');
        return numA - numB;
    });

    for (const key of sortedKeys) {
        const value = formulario[key];
        if (value === undefined || value === null || value === '') continue;

        // Evita exibir campos técnicos como row_number ou change_type
        if (['row_number', 'change_type', 'Carimbo de data/hora'].includes(key)) continue;

        if (/^2\./.test(key) || key.includes('E-mail') || key.includes('horário')) {
            categories.cadastro.fields.push([key, value]);
        } else if (/^3\./.test(key)) {
            categories.renda.fields.push([key, value]);
        } else if (/^4\./.test(key)) {
            categories.despesas.fields.push([key, value]);
        } else if (/^(5|6|7|8|9|10|11|12|13)\./.test(key)) {
            categories.dividas.fields.push([key, value]);
        } else if (/^14\./.test(key)) {
            categories.negativacoes.fields.push([key, value]);
        } else if (/^15\./.test(key)) {
            categories.habitos.fields.push([key, value]);
        } else if (/^(16|17)\./.test(key)) {
            categories.objetivos.fields.push([key, value]);
        } else {
            categories.outros.fields.push([key, value]);
        }
    }

    return Object.values(categories).filter(cat => cat.fields.length > 0);
};

export default function LeadProfile() {
    const { id } = useParams();
    const [lead, setLead] = useState<Lead | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Novo estado para o diagnóstico completo
    const [diagnosticoCompleto, setDiagnosticoCompleto] = useState<any>(null);
    const [loadingDiagnostico, setLoadingDiagnostico] = useState(false);

    useEffect(() => {
        apiFetch(`/api/leads/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Lead não encontrado");
                return res.json();
            })
            .then(data => setLead(data))
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        if (activeTab === 'diagnóstico completo' && !diagnosticoCompleto && !loadingDiagnostico) {
            setLoadingDiagnostico(true);
            apiFetch(`/api/leads/${id}/diagnostico`)
                .then(res => {
                    if (!res.ok) throw new Error("Diagnóstico não encontrado");
                    return res.json();
                })
                .then(data => {
                    setDiagnosticoCompleto(data);
                    setLoadingDiagnostico(false);
                })
                .catch(err => {
                    console.error("Erro ao buscar diagnóstico completo:", err);
                    setLoadingDiagnostico(false);
                    // Deixa nulo se não houver
                });
        }
    }, [activeTab, id, diagnosticoCompleto, loadingDiagnostico]);

    if (!lead) return (
        <div className="p-8 text-center text-zinc-500 font-medium mt-20">
            <div className="w-6 h-6 border-2 border-[#635bff]/30 border-t-[#635bff] rounded-full animate-spin mx-auto mb-2" />
            Carregando perfil...
        </div>
    );

    const timeline = [
        { event: 'Triagem Finalizada', time: 'Agora', icon: 'smart_toy', color: 'brand' },
        { event: 'Lead Capturado', time: new Date(lead.updated_at).toLocaleDateString(), icon: 'person_add', color: 'emerald' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card">
                <div className="flex items-start gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#635bff] to-violet-600 flex items-center justify-center text-3xl font-bold shadow-glow">
                            {lead.nome?.substring(0, 2).toUpperCase() || 'LR'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br from-[#635bff] to-violet-600 flex items-center justify-center border-2 border-[#18181b]">
                            <span className="material-symbols-outlined text-white text-sm">verified</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">{lead.nome || lead.telefone}</h1>
                                <p className="text-zinc-500 mt-1">Score: {lead.score}</p>
                            </div>
                            <span className={`badge ${lead.classificacao === 'QUENTE' ? 'badge-hot' : lead.classificacao === 'MORNO' ? 'badge-warm' : 'badge-cold'}`}>
                                {lead.classificacao || 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                            <a
                                href={`https://wa.me/${lead.telefone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-primary flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">chat</span>
                                WhatsApp
                            </a>
                            <button className="btn-secondary flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">call</span>
                                Ligar
                            </button>
                            <button className="btn-secondary flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">email</span>
                                Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-[#1c1c24] rounded-xl w-fit">
                {['Overview', 'Diagnóstico Parcial', 'Diagnóstico Completo', 'Timeline', 'Deals', 'Notas'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase())}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.toLowerCase()
                                ? 'bg-[#635bff] text-white'
                                : 'text-zinc-500 hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'diagnóstico parcial' && (
                <div className="space-y-6">
                    {(() => {
                        let parsedDados: any = null;
                        try {
                            if (lead.dados_lead) {
                                parsedDados = typeof lead.dados_lead === 'string' ? JSON.parse(lead.dados_lead) : lead.dados_lead;
                            }
                        } catch (e) {
                            console.error("Erro ao fazer parse dos dados:", e);
                        }

                        const formulario = parsedDados?.formulario;
                        if (!formulario) {
                            return (
                                <div className="card text-center py-12">
                                    <span className="material-symbols-outlined text-5xl text-zinc-600 mb-4">analytics</span>
                                    <p className="text-zinc-400 font-medium">Nenhum dado de formulário preenchido para este lead ainda.</p>
                                    <p className="text-zinc-600 text-sm mt-1">Quando o formulário do Google for respondido, as informações aparecerão aqui.</p>
                                </div>
                            );
                        }

                        const categories = getFormCategories(formulario);

                        return (
                            <div className="space-y-6">
                                {categories.map((cat, idx) => (
                                    <div key={idx} className="card">
                                        <div className="flex items-center gap-2 mb-4 border-b border-[#2a2a35] pb-3">
                                            <span className="material-symbols-outlined text-[#6366f1]">{cat.icon}</span>
                                            <h3 className="text-lg font-bold text-zinc-100">{cat.title}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {cat.fields.map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="flex flex-col p-3 rounded-xl bg-[#1c1c24] border border-[#2a2a35] hover:border-[#635bff]/20 transition-all"
                                                >
                                                    <span className="text-zinc-500 text-xs font-semibold mb-1">{key}</span>
                                                    <span className="text-zinc-100 text-sm font-medium whitespace-pre-line leading-relaxed">
                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            )}

            {activeTab === 'diagnóstico completo' && (
                <div className="space-y-6">
                    {loadingDiagnostico ? (
                        <div className="p-8 text-center text-zinc-500 font-medium mt-10">
                            <div className="w-6 h-6 border-2 border-[#635bff]/30 border-t-[#635bff] rounded-full animate-spin mx-auto mb-2" />
                            Buscando diagnóstico completo...
                        </div>
                    ) : !diagnosticoCompleto ? (
                        <div className="card text-center py-12">
                            <span className="material-symbols-outlined text-5xl text-zinc-600 mb-4">description</span>
                            <p className="text-zinc-400 font-medium">Diagnóstico Financeiro Completo não encontrado.</p>
                            <p className="text-zinc-600 text-sm mt-1">O lead ainda não preencheu ou pagou pelo formulário longo.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Card Resumo */}
                            <div className="card">
                                <div className="flex items-center gap-2 mb-4 border-b border-[#2a2a35] pb-3">
                                    <span className="material-symbols-outlined text-[#6366f1]">person</span>
                                    <h3 className="text-lg font-bold text-zinc-100">Perfil Financeiro</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 rounded-xl bg-[#1c1c24] border border-[#2a2a35]">
                                        <p className="text-zinc-500 text-xs font-semibold mb-1">Renda Líquida</p>
                                        <p className="text-zinc-100 text-sm font-medium">{diagnosticoCompleto.renda_mensal_liquida || '-'}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-[#1c1c24] border border-[#2a2a35]">
                                        <p className="text-zinc-500 text-xs font-semibold mb-1">Tipo de Renda</p>
                                        <p className="text-zinc-100 text-sm font-medium">{diagnosticoCompleto.renda_tipo || '-'}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-[#1c1c24] border border-[#2a2a35]">
                                        <p className="text-zinc-500 text-xs font-semibold mb-1">Ocupação</p>
                                        <p className="text-zinc-100 text-sm font-medium">{diagnosticoCompleto.ocupacao || '-'}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-[#1c1c24] border border-[#2a2a35]">
                                        <p className="text-zinc-500 text-xs font-semibold mb-1">Dependentes</p>
                                        <p className="text-zinc-100 text-sm font-medium">{diagnosticoCompleto.dependentes || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Dívidas Detalhadas */}
                            <div className="card">
                                <div className="flex items-center gap-2 mb-4 border-b border-[#2a2a35] pb-3">
                                    <span className="material-symbols-outlined text-rose-500">account_balance</span>
                                    <h3 className="text-lg font-bold text-zinc-100">Dívidas Mapeadas</h3>
                                </div>
                                <div className="space-y-3">
                                    {(() => {
                                        try {
                                            const dividas = typeof diagnosticoCompleto.dividas_detalhadas === 'string'
                                                ? JSON.parse(diagnosticoCompleto.dividas_detalhadas)
                                                : diagnosticoCompleto.dividas_detalhadas;

                                            if (!dividas || dividas.length === 0) return <p className="text-zinc-500 text-sm">Nenhuma dívida especificada.</p>;

                                            return dividas.map((d: any, idx: number) => (
                                                <div key={idx} className="p-4 rounded-xl bg-[#1c1c24] border border-[#2a2a35] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div>
                                                        <h4 className="text-white font-semibold">{d.credor || 'Credor não informado'}</h4>
                                                        <p className="text-xs text-zinc-400">{d.tipo}</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="text-right">
                                                            <p className="text-xs text-zinc-500">Valor Total</p>
                                                            <p className="font-medium text-rose-400">R$ {d.valor_total || '0'}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-zinc-500">Parcela</p>
                                                            <p className="font-medium text-zinc-200">R$ {d.valor_parcela || '0'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1 items-end text-xs">
                                                        <span className={`px-2 py-0.5 rounded-full ${d.atraso === 'Sim' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                            {d.atraso === 'Sim' ? 'Em Atraso' : 'Em Dia'}
                                                        </span>
                                                        {d.meses_atraso && d.meses_atraso !== 'não se aplica' && (
                                                            <span className="text-zinc-500">{d.meses_atraso}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ));
                                        } catch (e) {
                                            return <p className="text-zinc-500 text-sm">Erro ao carregar dívidas.</p>;
                                        }
                                    })()}

                                    {diagnosticoCompleto.outras_dividas_resumo && (
                                        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                                            <p className="text-xs text-rose-300 font-semibold mb-1">Outras Dívidas (Resumo)</p>
                                            <p className="text-sm text-zinc-300">{diagnosticoCompleto.outras_dividas_resumo}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Detalhes Complementares em Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Gastos Mensais */}
                                <div className="card">
                                    <div className="flex items-center gap-2 mb-4 border-b border-[#2a2a35] pb-3">
                                        <span className="material-symbols-outlined text-emerald-500">shopping_cart</span>
                                        <h3 className="text-lg font-bold text-zinc-100">Gastos & Sobrevivência</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-[#2a2a35]">
                                            <span className="text-sm text-zinc-400">Custo Mês Básico</span>
                                            <span className="text-sm font-medium text-white">{diagnosticoCompleto.custo_mes_basico || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-[#2a2a35]">
                                            <span className="text-sm text-zinc-400">Despesas Atrasadas?</span>
                                            <span className="text-sm font-medium text-white">{diagnosticoCompleto.despesas_atrasadas || '-'}</span>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-xs font-semibold text-zinc-500 mb-2">Comportamento</p>
                                            {(() => {
                                                try {
                                                    const comp = typeof diagnosticoCompleto.comportamento_financeiro === 'string' ? JSON.parse(diagnosticoCompleto.comportamento_financeiro) : diagnosticoCompleto.comportamento_financeiro;
                                                    return (
                                                        <ul className="text-sm text-zinc-300 space-y-1">
                                                            <li>• Maior descontrole: {comp?.causa_descontrole || '-'}</li>
                                                            <li>• Reserva de emergência: {comp?.reserva || '-'}</li>
                                                        </ul>
                                                    );
                                                } catch (e) { return null; }
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Situação Jurídica */}
                                <div className="card">
                                    <div className="flex items-center gap-2 mb-4 border-b border-[#2a2a35] pb-3">
                                        <span className="material-symbols-outlined text-amber-500">gavel</span>
                                        <h3 className="text-lg font-bold text-zinc-100">Situação Jurídica</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {(() => {
                                            try {
                                                const jur = typeof diagnosticoCompleto.situacao_juridica === 'string' ? JSON.parse(diagnosticoCompleto.situacao_juridica) : diagnosticoCompleto.situacao_juridica;
                                                if (!jur) return <p className="text-sm text-zinc-500">Sem dados.</p>;

                                                return (
                                                    <>
                                                        <div className="flex justify-between items-center p-2 rounded-lg bg-[#1c1c24]">
                                                            <span className="text-sm text-zinc-400">Negativado?</span>
                                                            <span className={`text-sm font-medium ${jur.negativado === 'Sim' ? 'text-rose-400' : 'text-emerald-400'}`}>{jur.negativado || '-'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-2 rounded-lg bg-[#1c1c24]">
                                                            <span className="text-sm text-zinc-400">Ação Judicial?</span>
                                                            <span className={`text-sm font-medium ${jur.acao_judicial === 'Sim' ? 'text-rose-400' : 'text-zinc-300'}`}>{jur.acao_judicial || '-'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-2 rounded-lg bg-[#1c1c24]">
                                                            <span className="text-sm text-zinc-400">Bloqueio/Penhora?</span>
                                                            <span className={`text-sm font-medium ${jur.bloqueio === 'Sim' ? 'text-rose-400' : 'text-zinc-300'}`}>{jur.bloqueio || '-'}</span>
                                                        </div>
                                                    </>
                                                );
                                            } catch (e) { return null; }
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact Info */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Informações Financeiras</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1c1c24]">
                                <div className="w-10 h-10 rounded-xl bg-[#635bff]/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#6366f1]">warning</span>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Dificuldade Financeira</p>
                                    <p className="font-medium text-sm">{getLabel(lead.dificuldade_financeira, DIFICULDADE_FINANCEIRA)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1c1c24]">
                                <div className="w-10 h-10 rounded-xl bg-[#635bff]/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#6366f1]">account_balance</span>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Tipo de Dívida</p>
                                    <p className="font-medium text-sm">{getLabel(lead.tipo_divida, TIPO_DIVIDA)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1c1c24]">
                                <div className="w-10 h-10 rounded-xl bg-[#635bff]/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#6366f1]">pie_chart</span>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Renda Comprometida</p>
                                    <p className="font-medium text-sm">{getLabel(lead.renda_comprometida, RENDA_COMPROMETIDA)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dados de Identificação */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Dados de Identificação</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1c1c24]">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-violet-400">fingerprint</span>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">CPF</p>
                                    <p className="font-medium text-sm">{lead.cpf || 'Não informado'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1c1c24]">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-400">mail</span>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">E-mail</p>
                                    <p className="font-medium text-sm text-ellipsis overflow-hidden max-w-[180px]" title={lead.email}>{lead.email || 'Não informado'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1c1c24]">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-amber-400">location_on</span>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Localização</p>
                                    <p className="font-medium text-sm">{lead.cidade_estado || 'Não informado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Dados Adicionais</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1c1c24]">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-emerald-400">payments</span>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Fonte de Renda</p>
                                    <p className="font-medium text-sm">{getLabel(lead.fonte_renda, FONTE_RENDA)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1c1c24]">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-amber-400">schedule</span>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Atraso/Negativação</p>
                                    <p className="font-medium text-sm">{getLabel(lead.atraso_negativacao, ATRASO_NEGATIVACAO)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#1c1c24]">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-violet-400">fact_check</span>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Fase Atual</p>
                                    <p className="font-medium text-sm">{lead.estado_atual.replace('AGUARDANDO_', 'Etapa ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'timeline' && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-6">Timeline</h3>
                    <div className="relative pl-8 space-y-6">
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[#2a2a35]" />
                        {timeline.map((item, index) => (
                            <div key={index} className="relative flex items-center gap-4">
                                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${item.color === 'brand' ? 'bg-[#635bff]/20 text-[#6366f1]' :
                                        item.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                                            'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                                </div>
                                <div className="flex-1 p-4 rounded-xl bg-[#1c1c24]">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">{item.event}</p>
                                        <p className="text-xs text-zinc-500">{item.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'deals' && (
                <div className="card text-center py-12">
                    <span className="material-symbols-outlined text-5xl text-zinc-600 mb-4">handshake</span>
                    <p className="text-zinc-500">Nenhum negócio criado</p>
                    <button className="btn-primary mt-4">
                        <span className="material-symbols-outlined mr-2">add</span>
                        Novo Negócio
                    </button>
                </div>
            )}

            {activeTab === 'notas' && (
                <div className="card text-center py-12">
                    <span className="material-symbols-outlined text-5xl text-zinc-600 mb-4">note</span>
                    <p className="text-zinc-500">Nenhuma nota adicionada</p>
                    <button className="btn-primary mt-4">
                        <span className="material-symbols-outlined mr-2">add</span>
                        Adicionar Nota
                    </button>
                </div>
            )}
        </div>
    );
}