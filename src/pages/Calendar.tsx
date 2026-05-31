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
}

interface Lead {
    id: string;
    nome: string;
}

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'week'>('month');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    const fetchData = useCallback(() => {
        setLoading(true);
        apiFetch('/api/tasks?limit=100')
            .then(res => res.json())
            .then(data => {
                setTasks((data.data || []).filter((t: Task) => t.due_date));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchData();
        apiFetch('/api/leads?limit=100')
            .then(res => res.json())
            .then(data => {
                setLeads(data.data || []);
            })
            .catch(err => console.error(err));
    }, [fetchData]);

    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const getTasksForDay = (day: number) => {
        return tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            return taskDate.getDate() === day && 
                taskDate.getMonth() === currentDate.getMonth() &&
                taskDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && 
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const getLeadName = (leadId: string) => {
        const lead = leads.find(l => l.id === leadId);
        return lead?.nome || 'Lead';
    };
    void getLeadName;

    const upcomingTasks = tasks.slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Calendário</h1>
                    <p className="text-zinc-500 mt-1">{tasks.length} eventos agendados</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 rounded-xl bg-[#1c1c24] hover:bg-[#2a2a35]">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="text-lg font-semibold min-w-[150px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 rounded-xl bg-[#1c1c24] hover:bg-[#2a2a35]">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="btn-secondary text-sm">Hoje</button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex gap-1 p-1 bg-[#1c1c24] rounded-xl">
                    {['month', 'week'].map((v) => (
                        <button key={v} onClick={() => setView(v as 'month' | 'week')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === v ? 'bg-[#635bff] text-white' : 'text-zinc-500 hover:text-white'}`}>
                            {v === 'month' ? 'Mês' : 'Semana'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                <div className="col-span-3 card">
                    <div className="grid grid-cols-7 mb-2">
                        {weekdays.map((day) => (
                            <div key={day} className="text-center text-sm text-zinc-500 font-medium py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-2 border-[#635bff]/30 border-t-[#635bff] rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 gap-1">
                            {emptyDays.map((_, idx) => (
                                <div key={`empty-${idx}`} className="h-24 p-1" />
                            ))}
                            {days.map((day) => {
                                const dayTasks = getTasksForDay(day);
                                return (
                                    <div key={day} onClick={() => setSelectedDate(selectedDate === day ? null : day)} className={`h-24 p-2 rounded-xl cursor-pointer transition-all hover:bg-[#252529] ${isToday(day) ? 'bg-[#635bff]/20 border border-[#635bff]' : 'bg-[#1c1c24]'}`}>
                                        <span className={`text-sm font-medium ${isToday(day) ? 'text-[#6366f1]' : ''}`}>
                                            {day}
                                        </span>
                                        <div className="mt-1 space-y-1">
                                            {dayTasks.slice(0, 2).map((task) => (
                                                <div key={task.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                                                    task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                    {task.title}
                                                </div>
                                            ))}
                                            {dayTasks.length > 2 && (
                                                <span className="text-[10px] text-zinc-500">
                                                    +{dayTasks.length - 2} mais
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Próximos Eventos</h3>
                        <div className="space-y-3">
                            {upcomingTasks.length === 0 ? (
                                <p className="text-sm text-zinc-500 text-center py-4">Nenhum evento</p>
                            ) : (
                                upcomingTasks.map((task) => (
                                    <div key={task.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#252529] transition-all">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                            task.status === 'COMPLETED' ? 'bg-emerald-500' :
                                            task.priority === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'
                                        }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{task.title}</p>
                                            <p className="text-xs text-zinc-500">
                                                {task.due_date && new Date(task.due_date).toLocaleString('pt-BR', { 
                                                    day: 'numeric', 
                                                    month: 'short',
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-sm text-zinc-500">
                                            {task.status === 'COMPLETED' ? 'check_circle' : 'schedule'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Legenda</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-sm text-zinc-500">Alta prioridade</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="text-sm text-zinc-500">Média prioridade</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-sm text-zinc-500">Concluído</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}