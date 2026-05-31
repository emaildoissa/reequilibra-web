import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { CLASSIFICACAO, getLabel } from '../utils/labels';

interface Lead {
    id: string;
    telefone: string;
    nome: string;
    score: number;
    classificacao: string;
    estado_atual: string;
}

const columns = [
    { id: '', label: 'Sem Fase', color: '#71717a', icon: 'help_outline' },
    { id: 'AGUARDANDO_CONTATO', label: 'Novo', color: '#6366f1', icon: 'person_add' },
    { id: 'EM_CONTATO', label: 'Contato', color: '#8b5cf6', icon: 'call' },
    { id: 'EM_TRIAGEM', label: 'Triagem', color: '#a78bfa', icon: 'fact_check' },
    { id: 'AGUARDANDO_PROPOSTA', label: 'Proposta', color: '#f472b6', icon: 'description' },
    { id: 'FINALIZADO', label: 'Finalizado', color: '#34d399', icon: 'check_circle' },
];

export default function Kanban() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const fetchLeads = useCallback(() => {
        apiFetch('/api/leads')
            .then(res => res.json())
            .then(data => {
                setLeads(data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const getLeadsByColumn = (columnId: string) => {
        return leads.filter(lead => lead.estado_atual === columnId);
    };

    const handleDragStart = (e: React.DragEvent, lead: Lead) => {
        setDraggedLead(lead);
        e.dataTransfer.setData('text/plain', lead.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = async (e: React.DragEvent, newEstado: string) => {
        e.preventDefault();
        setDragOverColumn(null);
        
        const leadId = e.dataTransfer.getData('text/plain');
        if (!leadId || !draggedLead) return;

        if (draggedLead.estado_atual === newEstado) {
            setDraggedLead(null);
            return;
        }

        try {
            const response = await apiFetch(`/api/leads/${leadId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado_atual: newEstado }),
            });

            if (response.ok) {
                setLeads(prevLeads => 
                    prevLeads.map(lead => 
                        lead.id === leadId 
                            ? { ...lead, estado_atual: newEstado }
                            : lead
                    )
                );
            } else {
                console.error('Failed to update lead');
            }
        } catch (err) {
            console.error('Error updating lead:', err);
        }

        setDraggedLead(null);
    };

    return (
        <div className="h-[calc(100vh-8rem)] space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Pipeline</h1>
                    <p className="text-zinc-500 mt-1">Arraste os cards para mover os leads entre etapas.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2">
                        <span className="material-symbols-outlined">filter_list</span>
                        Filtros
                    </button>
                    <button className="btn-primary flex items-center gap-2">
                        <span className="material-symbols-outlined">add</span>
                        Novo Lead
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-4 h-full overflow-x-auto pb-4">
                {columns.map((column) => {
                    const columnLeads = getLeadsByColumn(column.id);
                    const isDragOver = dragOverColumn === column.id;
                    
                    return (
                        <div 
                            key={column.id}
                            className={`w-72 shrink-0 flex flex-col transition-all ${
                                isDragOver ? 'scale-[1.02]' : ''
                            }`}
                            onDragOver={(e) => handleDragOver(e, column.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between p-3 rounded-t-xl bg-[#1c1c24]">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: column.color }} 
                                    />
                                    <span className="font-semibold">{column.label}</span>
                                    <span className="text-xs text-zinc-500 bg-[#2a2a35] px-2 py-0.5 rounded-full">
                                        {columnLeads.length}
                                    </span>
                                </div>
                                <button className="text-zinc-500 hover:text-white">
                                    <span className="material-symbols-outlined text-lg">more_horiz</span>
                                </button>
                            </div>

                            {/* Column Content */}
                            <div className={`flex-1 p-2 rounded-b-xl space-y-2 overflow-y-auto min-h-[200px] transition-all ${
                                isDragOver 
                                    ? 'bg-[#635bff]/10 border-2 border-dashed border-[#635bff]' 
                                    : 'bg-[#12121a]'
                            }`}>
                                {loading ? (
                                    <div className="text-center py-8 text-zinc-500">
                                        <div className="w-5 h-5 border-2 border-[#635bff]/30 border-t-[#635bff] rounded-full animate-spin mx-auto" />
                                    </div>
                                ) : columnLeads.length === 0 ? (
                                    <div className="text-center py-8 text-zinc-600 text-sm">
                                        Nenhum lead
                                    </div>
                                ) : columnLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, lead)}
                                        className="p-3 bg-[#18181b] rounded-xl border border-[#2a2a35] cursor-grab active:cursor-grabbing hover:border-[#635bff]/50 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <Link 
                                                to={`/lead/${lead.id}`}
                                                className="font-medium hover:text-[#6366f1] transition-colors truncate"
                                            >
                                                {lead.nome || lead.telefone}
                                            </Link>
                                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                                                lead.classificacao === 'QUENTE' ? 'bg-red-500' :
                                                lead.classificacao === 'MORNO' ? 'bg-amber-500' :
                                                'bg-zinc-500'
                                            }`} 
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-zinc-500">
                                            <span>Score: {lead.score}</span>
                                            <span className={`badge text-[10px] py-0 ${
                                                lead.classificacao === 'QUENTE' ? 'badge-hot' :
                                                lead.classificacao === 'MORNO' ? 'badge-warm' : 'badge-cold'
                                            }`}>
                                                {getLabel(lead.classificacao, CLASSIFICACAO)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 rounded-lg hover:bg-[#2a2a35] text-zinc-500 hover:text-white">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <a 
                                                href={`https://wa.me/${lead.telefone}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1 rounded-lg hover:bg-[#2a2a35] text-zinc-500 hover:text-white"
                                            >
                                                <span className="material-symbols-outlined text-sm">chat</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}