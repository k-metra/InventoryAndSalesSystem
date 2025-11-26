import { createContext, useContext, useState } from 'react';
import api from './../axios/api';

interface User {
    full_name: string;
    username: string;
    role: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    user: User | null;   
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => {},
    logout: async () => {},
    user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Implementation of authentication logic would go here
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (credentials: { username: string; password: string }) => {

        if (isAuthenticated) {
            throw new Error('Tried to log in but already authenticated');
        }

        if (credentials.username.length <= 1 || credentials.password.length <= 6) {
            throw new Error('Invalid credentials');
        }

        // TODO: api login here
    }

    const logout = async () => {
        if (!isAuthenticated) {
            throw new Error('Tried to log out but not authenticated');
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;