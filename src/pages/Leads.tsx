import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { apiFetch } from '../utils/api';
import { CLASSIFICACAO, getLabel } from '../utils/labels';

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

export default function Leads() {
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [filtros, setFiltros] = useState({ busca: '', classificacao: '', estado: '' });
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const queryKey = useMemo(() => 
        ['/api/leads', pagination.page, pagination.limit, filtros.busca, filtros.classificacao, filtros.estado],
        [pagination.page, pagination.limit, filtros.busca, filtros.classificacao, filtros.estado]
    );

    const { data, isLoading, mutate } = useSWR<Lead[]>(queryKey, async () => {
        const params = new URLSearchParams();
        params.append('page', pagination.page.toString());
        params.append('limit', pagination.limit.toString());
        if (filtros.busca) params.append('busca', filtros.busca);
        if (filtros.classificacao) params.append('classificacao', filtros.classificacao);
        if (filtros.estado) params.append('estado', filtros.estado);

        const res = await apiFetch(`/api/leads?${params}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setPagination(prev => ({
            ...prev,
            total: json.total,
            totalPages: json.totalPages
        }));
        return json.data || [];
    }, { 
        revalidateOnFocus: false,
        dedupingInterval: 5000 
    });

    const leads = data || [];
    const loading = isLoading || !data;

    const handleDelete = async (id: string) => {
        try {
            const res = await apiFetch(`/api/leads/${id}`, { method: 'DELETE' });
            if (res.ok) {
                mutate();
            }
        } catch (err) {
            console.error(err);
        }
        setDeleteId(null);
    };

    const exportarCSV = () => {
        const headers = ['Nome', 'Telefone', 'Score', 'Classificação', 'Estado', 'Data Criação'];
        const rows = leads.map((l: Lead) => [
            l.nome || '',
            l.telefone || '',
            l.score.toString(),
            l.classificacao || '',
            l.estado_atual || '',
            new Date(l.created_at).toLocaleDateString()
        ]);
        
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getClassColor = (classif: string): string => {
        if (classif === 'QUENTE') return 'badge-hot';
        if (classif === 'MORNO') return 'badge-warm';
        return 'badge-cold';
    };

    const aplicarFiltros = () => {
        setPagination(prev => ({ ...prev, page: 1 }));
        mutate();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Leads</h1>
                    <p className="text-zinc-500 mt-1">{pagination.total} leads cadastrados</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={exportarCSV} className="btn-secondary flex items-center gap-2">
                        <span className="material-symbols-outlined">download</span>
                        Exportar CSV
                    </button>
                    <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">add</span>
                        Novo Lead
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou telefone..."
                            value={filtros.busca}
                            onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                            className="input"
                        />
                    </div>
                    <select
                        value={filtros.classificacao}
                        onChange={(e) => setFiltros(prev => ({ ...prev, classificacao: e.target.value }))}
                        className="input w-auto"
                    >
                        <option value="">Todas classificações</option>
                        <option value="QUENTE">Quentes</option>
                        <option value="MORNO">Mornos</option>
                        <option value="FRIO">Frios</option>
                    </select>
                    <select
                        value={filtros.estado}
                        onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
                        className="input w-auto"
                    >
                        <option value="">Todos estados</option>
                        <option value="AGUARDANDO_CONTATO">Novo</option>
                        <option value="EM_CONTATO">Contato</option>
                        <option value="EM_TRIAGEM">Triagem</option>
                        <option value="AGUARDANDO_PROPOSTA">Proposta</option>
                        <option value="FINALIZADO">Finalizado</option>
                    </select>
                    <button onClick={aplicarFiltros} className="btn-secondary">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#1c1c24]">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-zinc-500">Nome</th>
                                <th className="text-left p-4 text-sm font-medium text-zinc-500">Telefone</th>
                                <th className="text-left p-4 text-sm font-medium text-zinc-500">Score</th>
                                <th className="text-left p-4 text-sm font-medium text-zinc-500">Classificação</th>
                                <th className="text-left p-4 text-sm font-medium text-zinc-500">Estado</th>
                                <th className="text-left p-4 text-sm font-medium text-zinc-500">Data</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                                        <div className="w-6 h-6 border-2 border-[#635bff]/30 border-t-[#635bff] rounded-full animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                                        Nenhum lead encontrado
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead: Lead) => (
                                    <tr key={lead.id} className="border-t border-[#2a2a35] hover:bg-[#1c1c24] transition-colors">
                                        <td className="p-4">
                                            <Link to={`/lead/${lead.id}`} className="font-medium hover:text-[#6366f1]">
                                                {lead.nome || '-'}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-zinc-400">{lead.telefone || '-'}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded-lg bg-[#2a2a35] text-sm font-medium">
                                                {lead.score}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`badge ${getClassColor(lead.classificacao)}`}>
                                                {getLabel(lead.classificacao, CLASSIFICACAO)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-zinc-400">
                                            {lead.estado_atual?.replace(/_/g, ' ') || '-'}
                                        </td>
                                        <td className="p-4 text-zinc-400">
                                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/lead/${lead.id}`} className="p-2 hover:bg-[#2a2a35] rounded-lg">
                                                    <span className="material-symbols-outlined text-zinc-400">visibility</span>
                                                </Link>
                                                <button 
                                                    onClick={() => setDeleteId(lead.id)}
                                                    className="p-2 hover:bg-[#2a2a35] rounded-lg"
                                                >
                                                    <span className="material-symbols-outlined text-zinc-400">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-[#2a2a35] flex items-center justify-between">
                        <button
                            onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                            disabled={pagination.page === 1}
                            className="btn-secondary"
                        >
                            Anterior
                        </button>
                        <span className="text-zinc-400">
                            Página {pagination.page} de {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                            disabled={pagination.page >= pagination.totalPages}
                            className="btn-secondary"
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1c1c24] p-6 rounded-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
                        <p className="text-zinc-400 mb-6">Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">
                                Cancelar
                            </button>
                            <button onClick={() => handleDelete(deleteId)} className="btn-primary flex-1 bg-red-600 hover:bg-red-700">
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && <NewLeadModal onClose={() => setShowModal(false)} onSave={() => mutate()} />}
        </div>
    );
}

function NewLeadModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!telefone) return;

        setLoading(true);
        try {
            const res = await apiFetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telefone, nome })
            });
            if (res.ok) {
                onSave();
                onClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1c1c24] p-6 rounded-xl max-w-md w-full mx-4">
                <h3 className="text-lg font-bold mb-4">Novo Lead</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Telefone *</label>
                        <input
                            type="text"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className="input w-full"
                            placeholder="5599999999999"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-zinc-400 mb-1">Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="input w-full"
                            placeholder="Nome do lead"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1">
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}