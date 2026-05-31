import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

interface Lead {
    id: string;
    telefone: string;
    nome: string;
    score: number;
    classificacao: string;
    estado_atual: string;
    dificuldade_financeira: string;
    renda_comprometida: string;
    contas_basicas: string;
    tipo_divida: string;
    fonte_renda: string;
    atraso_negativacao: string;
    documentos: string;
    intencao: string;
}

const opciones = {
    classificacao: [
        { value: 'QUENTE', label: 'Quente - Alto potencial' },
        { value: 'MORNO', label: 'Morno - Média conversão' },
        { value: 'FRIO', label: 'Frio - Baixa prioridade' },
    ],
    estado: [
        { value: 'AGUARDANDO_CONTATO', label: 'Novo' },
        { value: 'EM_CONTATO', label: 'Em Contato' },
        { value: 'EM_TRIAGEM', label: 'Em Triagem' },
        { value: 'AGUARDANDO_PROPOSTA', label: 'Aguardando Proposta' },
        { value: 'FINALIZADO', label: 'Finalizado' },
    ],
    dificuldade: [
        { value: '1', label: '1 - Muitas dívidas, não sei por onde começar' },
        { value: '2', label: '2 - Consignados descontando em folha' },
        { value: '3', label: '3 - Cartão de crédito muito alto' },
        { value: '4', label: '4 - Usando cheque especial' },
        { value: '5', label: '5 - Parcelas atrasadas' },
        { value: '6', label: '6 - Pago tudo, mas não sobra' },
        { value: '7', label: '7 - Quero me organizar' },
    ],
    renda: [
        { value: '1', label: '1 - Menos de 20%' },
        { value: '2', label: '2 - Entre 20% e 30%' },
        { value: '3', label: '3 - Entre 30% e 50%' },
        { value: '4', label: '4 - Mais de 50%' },
        { value: '5', label: '5 - Não sei calcular' },
    ],
    contas: [
        { value: '1', label: '1 - Sim, mas com dificuldade' },
        { value: '2', label: '2 - Não, atrasando contas' },
        { value: '3', label: '3 - Pago usando crédito' },
        { value: '4', label: '4 - Consigo pagar' },
    ],
    tipoDivida: [
        { value: '1', label: '1 - Consignado' },
        { value: '2', label: '2 - Cartão de crédito' },
        { value: '3', label: '3 - Cheque especial' },
        { value: '4', label: '4 - Empréstimo pessoal' },
        { value: '5', label: '5 - Financiamento' },
        { value: '6', label: '6 - Dívidas com lojas' },
        { value: '7', label: '7 - Várias ao mesmo tempo' },
        { value: '8', label: '8 - Não sei' },
    ],
    fonteRenda: [
        { value: '1', label: '1 - Servidor público' },
        { value: '2', label: '2 - Aposentado/pensionista' },
        { value: '3', label: '3 - CLT' },
        { value: '4', label: '4 - Autônomo' },
        { value: '5', label: '5 - Empresário' },
        { value: '6', label: '6 - Sem renda' },
    ],
    atraso: [
        { value: '1', label: '1 - Dívida atrasada' },
        { value: '2', label: '2 - Cobranças ativas' },
        { value: '3', label: '3 - Negativado' },
        { value: '4', label: '4 - Ação judicial' },
        { value: '5', label: '5 - Não' },
        { value: '6', label: '6 - Não sei' },
    ],
    documentos: [
        { value: '1', label: '1 - Sim, tenho boa parte' },
        { value: '2', label: '2 - Tenho alguns' },
        { value: '3', label: '3 - Consigo buscar' },
        { value: '4', label: '4 - Não sei onde' },
    ],
    intencao: [
        { value: '1', label: '1 - Sim, quer fazer' },
        { value: '2', label: '2 - Quer entender melhor' },
        { value: '3', label: '3 - Agora não' },
        { value: '4', label: '4 - Só orientação' },
    ],
};

export default function LeadEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        apiFetch(`/api/leads/${id}`)
            .then(res => res.json())
            .then(data => setLead(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSave = async () => {
        if (!lead) return;
        setSaving(true);
        try {
            const res = await apiFetch(`/api/leads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lead)
            });
            if (res.ok) {
                navigate(`/lead/${id}`);
            }
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#635bff]/30 border-t-[#635bff] rounded-full animate-spin" />
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="text-center py-12 text-zinc-500">
                Lead não encontrado
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to={`/lead/${id}`} className="p-2 rounded-lg hover:bg-[#2a2a35]">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Editar Lead</h1>
                        <p className="text-zinc-500">{lead.nome || lead.telefone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link to={`/lead/${id}`} className="btn-secondary">
                        Cancelar
                    </Link>
                    <button onClick={handleSave} disabled={saving} className="btn-primary">
                        {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>

            {/* Campos */}
            <div className="grid grid-cols-2 gap-6">
                {/* Dados Básicos */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Dados Básicos</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-zinc-500">Nome</label>
                            <input
                                type="text"
                                value={lead.nome || ''}
                                onChange={(e) => setLead({ ...lead, nome: e.target.value })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Telefone</label>
                            <input
                                type="text"
                                value={lead.telefone || ''}
                                onChange={(e) => setLead({ ...lead, telefone: e.target.value })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Score (0-30)</label>
                            <input
                                type="number"
                                min="0"
                                max="30"
                                value={lead.score || 0}
                                onChange={(e) => setLead({ ...lead, score: parseInt(e.target.value) || 0 })}
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Classificação</label>
                            <select
                                value={lead.classificacao || ''}
                                onChange={(e) => setLead({ ...lead, classificacao: e.target.value })}
                                className="input"
                            >
                                <option value="">Selecione...</option>
                                {opciones.classificacao.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Estado</label>
                            <select
                                value={lead.estado_atual || ''}
                                onChange={(e) => setLead({ ...lead, estado_atual: e.target.value })}
                                className="input"
                            >
                                <option value="">Selecione...</option>
                                {opciones.estado.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Dados da Triagem */}
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">Dados da Triagem</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-zinc-500">Dificuldade Financeira</label>
                            <select
                                value={lead.dificuldade_financeira || ''}
                                onChange={(e) => setLead({ ...lead, dificuldade_financeira: e.target.value })}
                                className="input"
                            >
                                <option value="">Selecione...</option>
                                {opciones.dificuldade.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Renda Comprometida</label>
                            <select
                                value={lead.renda_comprometida || ''}
                                onChange={(e) => setLead({ ...lead, renda_comprometida: e.target.value })}
                                className="input"
                            >
                                <option value="">Selecione...</option>
                                {opciones.renda.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Contas Básicas</label>
                            <select
                                value={lead.contas_basicas || ''}
                                onChange={(e) => setLead({ ...lead, contas_basicas: e.target.value })}
                                className="input"
                            >
                                <option value="">Selecione...</option>
                                {opciones.contas.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Tipo de Dívida</label>
                            <select
                                value={lead.tipo_divida || ''}
                                onChange={(e) => setLead({ ...lead, tipo_divida: e.target.value })}
                                className="input"
                            >
                                <option value="">Selecione...</option>
                                {opciones.tipoDivida.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Fonte de Renda</label>
                            <select
                                value={lead.fonte_renda || ''}
                                onChange={(e) => setLead({ ...lead, fonte_renda: e.target.value })}
                                className="input"
                            >
                                <option value="">Selecione...</option>
                                {opciones.fonteRenda.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Atraso/Negativação</label>
                            <select
                                value={lead.atraso_negativacao || ''}
                                onChange={(e) => setLead({ ...lead, atraso_negativacao: e.target.value })}
                                className="input"
                            >
                                <option value="">Selecione...</option>
                                {opciones.atraso.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Documentos</label>
                            <select
                                value={lead.documentos || ''}
                                onChange={(e) => setLead({ ...lead, documentos: e.target.value })}
                                className="input"
                            >
                                <option value="">Selecione...</option>
                                {opciones.documentos.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500">Intenção</label>
                            <select
                                value={lead.intencao || ''}
                                onChange={(e) => setLead({ ...lead, intencao: e.target.value })}
                                className="input"
                            >
                                <option value="">Selecione...</option>
                                {opciones.intencao.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}