import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from './../axios/api';
import sanctumApi from './../axios/sanctum';

export interface User {
    username: string;
    role: string;
}

interface AuthContextType {
    loading: boolean;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    user: User | null;   
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function AuthProvider({ children, initialUser }: { children: ReactNode, initialUser: User | null }) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [loading, setLoading] = useState(false);


    const login = async (credentials: { username: string; password: string }) => {
        if (credentials.username.length <= 1 || credentials.password.length <= 6) {
            throw new Error('Invalid credentials');
        }

        setLoading(true);

        return sanctumApi.get('/csrf-cookie') // CSRF TOKEN
        .then(() => {
            return api.post('/login', credentials)
            .then(response => {
                setUser(response.data.user);
            })
            .catch(error => {
                throw new Error(error.response?.data?.message || 'Login Failed');
            })
        }).catch((error) => {
            throw new Error(error);
        }).finally(() => {
            setLoading(false);
        })

    
    }

    const logout = async () => {
        if (!user) return;

        setLoading(true);
        await api.post('/logout');
        setLoading(false);

        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext);
};

export { useAuth, AuthProvider };