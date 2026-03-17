// import { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from '../../lib/supabase'
// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [session, setSession] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Check active sessions and sets the user
//         supabase.auth.getSession().then(({ data: { session } }) => {
//             setSession(session);
//             setUser(session?.user ?? null);
//             setLoading(false);
//         });

//         // Listen for changes on auth state
//         const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//             setSession(session);
//             setUser(session?.user ?? null);
//         });

//         return () => subscription.unsubscribe();
//     }, []);

//     const signUp = async (email, password) => {
//         const { data, error } = await supabase.auth.signUp({
//             email,
//             password
//         });
//         if (error) throw error;
//         return data;
//     };



//     const signIn = async (email, password) => {
//         const { data, error } = await supabase.auth.signInWithPassword({
//             email,
//             password,
//         });
//         if (error) throw error;
//         return data;
//     };

//     const signOut = () => {
//         return supabase.auth.signOut();
//     };

//     // Helper function to get the access token
//     const getAccessToken = () => {
//         return session?.access_token;
//     };

//     return (
//         <AuthContext.Provider value={{
//             user,
//             signUp,
//             signIn,
//             signOut,
//             getAccessToken, // Expose the getAccessToken function
//             isAuthenticated: !!user,
//             supabase


//         }}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { pb } from '../../../src/lib/pocketBase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check initial auth state
    useEffect(() => {
        if (pb.authStore.isValid) {
            setUser(pb.authStore.model);
        }
        setLoading(false);
    }, []);

    const signUp = async (email, password) => {
        try {
            const data = await pb.collection('users').create({
                email,
                password,
                passwordConfirm: password
            });
            setUser(data.record);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signIn = async (email, password) => {
        try {
            const data = await pb.collection('users').authWithPassword(email, password);
            setUser(data.record);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        pb.authStore.clear();
        setUser(null);
    };

    const value = {
        user,
        signUp,
        signIn,
        signOut,
        pb,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

