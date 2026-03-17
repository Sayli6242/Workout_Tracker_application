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

import pb from './pocketBase';

export const auth = {
    async signUp(email, password) {
        return await pb.collection('users').create({ email, password, passwordConfirm: password });
    },

    async signIn(email, password) {
        return await pb.collection('users').authWithPassword(email, password);
    },

    async signOut() {
        pb.authStore.clear();
    },
};
