// // src/lib/auth.js
// import supabase from './supabase';

// const auth = {
//     async signUp(email, password) {
//         const { user, session } = await supabase.auth.signUp({
//             email,
//             password,
//         });
//         return { user, session };
//     },

//     async signIn(email, password) {
//         const { user, session } = await supabase.auth.signIn({
//             email,
//             password,
//         });
//         return { user, session };
//     },

//     async signOut() {
//         await supabase.auth.signOut();
//     },

//     async getUser() {
//         const user = await supabase.auth.user();
//         return user;
//     },
// };

// export default auth;

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const auth = {
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        return data;
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    async signOut() {
        await supabase.auth.signOut();
    },

    async getSession() {
        const { data } = await supabase.auth.getSession();
        return data.session;
    },
};
