import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LeadProfile from './pages/LeadProfile';
import LeadEdit from './pages/LeadEdit';
import Tasks from './pages/Tasks';
import Kanban from './pages/Kanban';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Leads from './pages/Leads';
import Login from './pages/Login';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#635bff]/30 border-t-[#635bff] rounded-full animate-spin" />
            </div>
        );
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="leads" element={<Leads />} />
                    <Route path="lead/:id" element={<LeadProfile />} />
                    <Route path="lead/:id/edit" element={<LeadEdit />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="pipeline" element={<Kanban />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="calendar" element={<Calendar />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;