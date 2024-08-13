import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

interface AuthContextProps {
    session: Session | null;
    user: User | null;
    isLoading: boolean; // เพิ่ม isLoading เพื่อจัดการสถานะการโหลด
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // สถานะการโหลด

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false); // การโหลดเสร็จสิ้น
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false); // การโหลดเสร็จสิ้น
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setSession(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, isLoading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
