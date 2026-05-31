import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';

interface Task {
    id: string;
    lead_id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    due_date: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

interface TaskStats {
    pending: number;
    completed: number;
    overdue: number;
    total: number;
}

export default function Tasks() {
    const [activeTab, setActiveTab] = useState('pending');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<TaskStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);

    const fetchData = useCallback(() => {
        setLoading(true);
        Promise.all([
            apiFetch(`/api/tasks?status=${activeTab.toUpperCase()}`).then(r => r.json()),
            apiFetch('/api/tasks/stats').then(r => r.json())
        ])
        .then(([tasksData, statsData]) => {
            setTasks(tasksData.data || []);
            setStats(statsData);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await apiFetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (taskId: string) => {
        if (!confirm('Deletar esta tarefa?')) return;
        try {
            await apiFetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            priority: formData.get('priority'),
            lead_id: formData.get('lead_id') || null,
            due_date: formData.get('due_date') || null,
            status: 'PENDING'
        };

        try {
            if (editTask) {
                await apiFetch(`/api/tasks/${editTask.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
            } else {
                await apiFetch('/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
            }
            setShowModal(false);
            setEditTask(null);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const getPriorityColor = (p: string) => {
        if (p === 'HIGH') return 'text-red-400 bg-red-500/20';
        if (p === 'MEDIUM') return 'text-amber-400 bg-amber-500/20';
        return 'text-zinc-400 bg-zinc-600/30';
    };

    const getStatusIcon = (s: string) => {
        if (s === 'COMPLETED') return 'check_circle';
        if (s === 'OVERDUE') return 'warning';
        return 'pending_actions';
    };
    void getStatusIcon;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Tarefas</h1>
                    <p className="text-zinc-500 mt-1">Gerencie suas atividades.</p>
                </div>
                <button onClick={() => { setEditTask(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span>
                    Nova Tarefa
                </button>
            </div>

            {stats && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="card">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-amber-400">pending_actions</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                                <p className="text-sm text-zinc-500">Pendentes</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.completed}</p>
                                <p className="text-sm text-zinc-500">Concluídas</p>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-400">warning</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.overdue}</p>
                                <p className="text-sm text-zinc-500">Atrasadas</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-1 p-1 bg-[#1c1c24] rounded-xl w-fit">
                {['pending', 'completed', 'all'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab
                                ? 'bg-[#635bff] text-white'
                                : 'text-zinc-500 hover:text-white'
                        }`}
                    >
                        {tab === 'pending' ? 'Pendentes' : tab === 'completed' ? 'Concluídas' : 'Todas'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-[#635bff]/30 border-t-[#635bff] rounded-full animate-spin" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="card text-center py-12">
                    <span className="material-symbols-outlined text-5xl text-zinc-600 mb-4">event_note</span>
                    <p className="text-zinc-500">Nenhuma tarefa</p>
                    <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
                        Criar primeira tarefa
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div key={task.id} className="card group">
                            <div className="flex items-start gap-4">
                                <button
                                    onClick={() => handleStatusChange(task.id, task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED')}
                                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        task.status === 'COMPLETED'
                                            ? 'bg-emerald-500 border-emerald-500'
                                            : 'border-[#2a2a35] hover:border-[#6366f1]'
                                    }`}
                                >
                                    {task.status === 'COMPLETED' && (
                                        <span className="material-symbols-outlined text-white text-sm">check</span>
                                    )}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className={`font-semibold ${task.status === 'COMPLETED' ? 'text-zinc-500 line-through' : ''}`}>
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-sm text-zinc-500 mt-1">{task.description}</p>
                                            )}
                                        </div>
                                        <div className={`badge ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
                                        {task.due_date && (
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                {new Date(task.due_date).toLocaleDateString('pt-BR')}
                                            </div>
                                        )}
                                        {task.lead_id && (
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">person</span>
                                                Lead associado
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditTask(task); setShowModal(true); }} className="btn-secondary text-sm py-1.5">
                                            <span className="material-symbols-outlined text-sm mr-1">edit</span>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(task.id)} className="btn-secondary text-sm py-1.5 text-red-400 hover:bg-red-500/20">
                                            <span className="material-symbols-outlined text-sm mr-1">delete</span>
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="card max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">{editTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
                        <form onSubmit={handleSaveTask} className="space-y-4">
                            <div>
                                <label className="text-sm text-zinc-500">Título *</label>
                                <input name="title" defaultValue={editTask?.title} required className="input" placeholder="O que precisa fazer?" />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-500">Descrição</label>
                                <textarea name="description" defaultValue={editTask?.description} className="input min-h-[80px]" placeholder="Detalhes..." />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-500">Prioridade</label>
                                <select name="priority" defaultValue={editTask?.priority || 'MEDIUM'} className="input">
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-zinc-500">Data limite</label>
                                <input name="due_date" type="datetime-local" defaultValue={editTask?.due_date?.slice(0, 16)} className="input" />
                            </div>
                            <div>
                                <label className="text-sm text-zinc-500">Lead (opcional)</label>
                                <select name="lead_id" defaultValue={editTask?.lead_id || ''} className="input">
                                    <option value="">Nenhum</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowModal(false); setEditTask(null); }} className="btn-secondary flex-1">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editTask ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}