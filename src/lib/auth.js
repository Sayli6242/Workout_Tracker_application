// src/lib/auth.js
import supabase from './supabase';

const auth = {
    async signUp(email, password) {
        const { user, session } = await supabase.auth.signUp({
            email,
            password,
        });
        return { user, session };
    },

    async signIn(email, password) {
        const { user, session } = await supabase.auth.signIn({
            email,
            password,
        });
        return { user, session };
    },

    async signOut() {
        await supabase.auth.signOut();
    },

    async getUser() {
        const user = await supabase.auth.user();
        return user;
    },
};

export default auth;