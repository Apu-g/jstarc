import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if real credentials are provided
const isConfigured = supabaseUrl && supabaseAnonKey &&
    !supabaseUrl.includes('YOUR_') && supabaseUrl.startsWith('http');

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const BUCKET = 'jstarc-photos';

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseReady() {
    return !!supabase;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadToStorage(folder, filename, buffer, contentType = 'image/jpeg') {
    if (!supabase) throw new Error('Supabase not configured');

    const filePath = `${folder}/${filename}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, buffer, { contentType, upsert: true });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromStorage(filePath) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase.storage.from(BUCKET).remove([filePath]);
    if (error) throw new Error(`Delete failed: ${error.message}`);
}

/**
 * List files in a folder
 */
export async function listStorageFiles(folder) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(folder, { limit: 500, sortBy: { column: 'name', order: 'asc' } });

    if (error) throw new Error(`List failed: ${error.message}`);

    return (data || [])
        .filter(f => f.name && !f.name.startsWith('.'))
        .map(f => {
            const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(`${folder}/${f.name}`);
            return { name: f.name, src: urlData.publicUrl, size: f.metadata?.size || 0 };
        });
}
