import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { verifyToken, logout as apiLogout } from '../lib/api';

interface User {
    id: string;
    email: string;
    name: string;
    dealership: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    // Verify token validity with backend
                    const response = await verifyToken(token);
                    if (response.valid) {
                        setUser(response.user);
                    } else {
                        // Invalid token
                        apiLogout();
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Auth verification failed', error);
                    // Don't auto-logout on network error, but maybe on 401
                    // For now, trust local storage if verification fails (offline mode support)
                    // But if 401, verifyToken throws, so we should logout
                    // Let's assume verifyToken throws on 401
                    apiLogout();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = (newUser: User, token: string) => {
        setUser(newUser);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        apiLogout();
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
