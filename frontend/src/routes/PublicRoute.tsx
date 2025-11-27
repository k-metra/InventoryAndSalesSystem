import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    if (user !== null) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}