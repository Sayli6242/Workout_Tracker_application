import { supabase } from './auth';

// Upload a file to Supabase Storage
// bucket: 'avatars' | 'exercises' | 'progress-photos'
export async function uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });
    if (error) throw error;
    return data;
}

// Get a public URL for a file
export function getPublicUrl(bucket, path) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

// Upload profile avatar — auto-names by user id
export async function uploadAvatar(userId, file) {
    const ext = file.name.split('.').pop();
    const path = `${userId}/avatar.${ext}`;
    await uploadFile('avatars', path, file);
    return getPublicUrl('avatars', path);
}

// Upload exercise GIF/image
export async function uploadExerciseMedia(exerciseId, file) {
    const ext = file.name.split('.').pop();
    const path = `${exerciseId}.${ext}`;
    await uploadFile('exercises', path, file);
    return getPublicUrl('exercises', path);
}

// Upload progress photo
export async function uploadProgressPhoto(userId, file) {
    const ext = file.name.split('.').pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    await uploadFile('progress-photos', path, file);
    return getPublicUrl('progress-photos', path);
}

// Delete a file
export async function deleteFile(bucket, path) {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
}
