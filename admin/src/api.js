import { supabase } from './supabase';

export const api = {
    // Masters
    getMasters: async () => {
        const { data, error } = await supabase.from('masters').select('*').order('name');
        if (error) { console.error('getMasters error:', error); return []; }
        return data || [];
    },
    addMaster: async (masterData) => {
        let photoUrl = masterData.src || '';
        if (masterData.photoBase64) {
            photoUrl = await uploadFile('masters', masterData.photoFilename, masterData.photoBase64);
        }
        const { photoBase64, photoFilename, ...rest } = masterData;
        const { data, error } = await supabase.from('masters').insert([{ ...rest, src: photoUrl }]).select();
        if (error) throw error;
        return data;
    },
    updateMaster: async (masterData) => {
        let photoUrl = masterData.src || '';
        if (masterData.photoBase64) {
            photoUrl = await uploadFile('masters', masterData.photoFilename, masterData.photoBase64);
        }
        const { photoBase64, photoFilename, ...rest } = masterData;
        const { data, error } = await supabase.from('masters').update({ ...rest, src: photoUrl }).eq('id', masterData.id).select();
        if (error) throw error;
        return data;
    },
    deleteMaster: async (id) => {
        // First get the master to find the image URL
        const { data: master } = await supabase.from('masters').select('src').eq('id', id).single();
        if (master && master.src) {
            const path = extractStoragePath(master.src);
            if (path) {
                const { error: storageErr } = await supabase.storage.from('jstarc-photos').remove([path]);
                if (storageErr) console.warn("Storage delete failed: " + storageErr.message);
            }
        }

        const { error } = await supabase.from('masters').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    },

    // Black Belts
    getBlackbelts: async () => {
        const { data, error } = await supabase.from('blackbelts').select('*').order('name');
        if (error) { console.error('getBlackbelts error:', error); return []; }
        return data || [];
    },
    addBlackbelt: async (memberData) => {
        let photoUrl = memberData.img || '';
        if (memberData.photoBase64) {
            photoUrl = await uploadFile('blackbelts', memberData.photoFilename, memberData.photoBase64);
        }
        const { photoBase64, photoFilename, ...rest } = memberData;
        const { data, error } = await supabase.from('blackbelts').insert([{ ...rest, img: photoUrl }]).select();
        if (error) throw error;
        return data;
    },
    updateBlackbelt: async (memberData) => {
        let photoUrl = memberData.img || '';
        if (memberData.photoBase64) {
            photoUrl = await uploadFile('blackbelts', memberData.photoFilename, memberData.photoBase64);
        }
        const { photoBase64, photoFilename, ...rest } = memberData;
        const { data, error } = await supabase.from('blackbelts').update({ ...rest, img: photoUrl }).eq('id', memberData.id).select();
        if (error) throw error;
        return data;
    },
    deleteBlackbelt: async (id) => {
        // First get the blackbelt to find the image URL
        const { data: member } = await supabase.from('blackbelts').select('img').eq('id', id).single();
        if (member && member.img) {
            const path = extractStoragePath(member.img);
            if (path) {
                const { error: storageErr } = await supabase.storage.from('jstarc-photos').remove([path]);
                if (storageErr) console.warn("Storage delete failed: " + storageErr.message);
            }
        }

        const { error } = await supabase.from('blackbelts').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    },

    // Events
    getEvents: async () => {
        const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
        if (error) { console.error('getEvents error:', error); return []; }
        return data || [];
    },
    addEvent: async (eventData) => {
        const folder = eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const { data, error } = await supabase.from('events').insert([{ ...eventData, folder }]).select();
        if (error) throw error;
        return data;
    },
    updateEvent: async (eventData) => {
        const { data, error } = await supabase.from('events').update(eventData).eq('id', eventData.id).select();
        if (error) throw error;
        return data;
    },
    deleteEvent: async (id) => {
        // Find the event folder directly
        const { data: event } = await supabase.from('events').select('folder').eq('id', id).single();

        if (event && event.folder) {
            // Get all photos for this event from DB
            const { data: photos } = await supabase.from('event_photos').select('url').eq('event_id', id);

            let pathsToDelete = [];
            if (photos && photos.length > 0) {
                pathsToDelete = photos.map(p => extractStoragePath(p.url)).filter(Boolean);
            }

            // List the bucket folder to ensure we wipe all physical files, even ones missing from SQL
            try {
                const { data: listedFiles } = await supabase.storage.from('jstarc-photos').list(`events/${event.folder}`);
                if (listedFiles && listedFiles.length > 0) {
                    const extraPaths = listedFiles.map(f => `events/${event.folder}/${f.name}`);
                    pathsToDelete = [...new Set([...pathsToDelete, ...extraPaths])]; // deduplicate
                }
            } catch (listErr) {
                console.warn("Storage list failed:", listErr);
            }

            if (pathsToDelete.length > 0) {
                const { error: storageErr } = await supabase.storage.from('jstarc-photos').remove(pathsToDelete);
                if (storageErr) console.warn("Storage delete failed: " + storageErr.message);
            }
        }

        // Also delete associated event photos records (cascade might handle this, but safe to do explicit)
        await supabase.from('event_photos').delete().eq('event_id', id);
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;
        return { success: true };
    },

    // Event Photos
    getEventPhotos: async (folder) => {
        const { data, error } = await supabase.from('event_photos').select('*').eq('folder', folder);
        if (error) { console.error('getEventPhotos error:', error); return []; }
        return (data || []).map(p => p.url);
    },
    uploadEventPhotos: async ({ folder, photos }) => {
        const results = [];
        for (const photo of photos) {
            const url = await uploadFile(`events/${folder}`, photo.filename, photo.base64);
            const { data, error } = await supabase.from('event_photos').insert([{ folder, url, filename: photo.filename }]).select();
            if (error) console.error('Insert event photo error:', error);
            results.push(data);
        }
        return results;
    },
    deleteEventPhoto: async (photoUrl) => {
        // Delete from storage
        const path = extractStoragePath(photoUrl);
        if (path) {
            const { error: storageErr } = await supabase.storage.from('jstarc-photos').remove([path]);
            if (storageErr) console.warn("Storage delete failed: " + storageErr.message);
        }
        // Delete from DB
        const { error } = await supabase.from('event_photos').delete().eq('url', photoUrl);
        if (error) throw error;
        return { success: true };
    },

    // Gallery (Marquee)
    getGallery: async () => {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (error) { console.error('getGallery error:', error); return { files: [] }; }
        return { files: (data || []).map(item => ({ name: item.filename, src: item.url, id: item.id })) };
    },
    uploadGalleryPhotos: async ({ photos }) => {
        const results = [];
        for (const photo of photos) {
            const url = await uploadFile('gallery', photo.filename, photo.base64);
            const { data, error } = await supabase.from('gallery').insert([{ url, filename: photo.filename }]).select();
            if (error) console.error('Insert gallery photo error:', error);
            results.push(data);
        }
        return results;
    },
    deleteGalleryPhoto: async (filename) => {
        // Delete from storage
        const { error: storageErr } = await supabase.storage.from('jstarc-photos').remove([`gallery/${filename}`]);
        if (storageErr) console.warn("Storage delete failed: " + storageErr.message);

        // Delete from DB
        const { error } = await supabase.from('gallery').delete().eq('filename', filename);
        if (error) throw error;
        return { success: true };
    },
};

// Helper: upload base64 file to Supabase Storage
async function uploadFile(folder, filename, base64Data) {
    // Convert base64 to blob
    const base64 = base64Data.split(',')[1] || base64Data;
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const mimeMatch = base64Data.match(/data:(.*?);/);
    const contentType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const blob = new Blob([byteArray], { type: contentType });

    const timestamp = Date.now();
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${folder}/${timestamp}_${safeName}`;

    const { error } = await supabase.storage
        .from('jstarc-photos')
        .upload(path, blob, { contentType, upsert: true });

    if (error) {
        console.error('Upload error:', error);
        throw error;
    }

    const { data: urlData } = supabase.storage.from('jstarc-photos').getPublicUrl(path);
    return urlData.publicUrl;
}

// Helper: extract storage path from public URL
function extractStoragePath(url) {
    if (!url) return null;
    const match = url.match(/\/storage\/v1\/object\/public\/jstarc-photos\/(.+)/);
    return match ? match[1] : null;
}

export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
