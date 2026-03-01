import { NextResponse } from 'next/server';
import { supabase, uploadToStorage, deleteFromStorage, listStorageFiles, isSupabaseReady, BUCKET } from '@/lib/supabase';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request) {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503, headers: corsHeaders });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    if (!folder) return NextResponse.json({ error: 'Folder required' }, { status: 400, headers: corsHeaders });

    const safeFolder = folder.replace(/[^a-zA-Z0-9\-_]/g, '');

    // Try event_photos DB table first
    const { data: photos } = await supabase.from('event_photos').select('url').eq('folder', safeFolder);
    if (photos && photos.length > 0) {
        return NextResponse.json(photos.map(p => p.url), { headers: corsHeaders });
    }

    // Fallback: list from Storage directly
    try {
        const files = await listStorageFiles(`events/${safeFolder}`);
        if (files && files.length > 0) {
            return NextResponse.json(files.map(f => f.src), { headers: corsHeaders });
        }
    } catch (e) { /* ignore */ }

    return NextResponse.json([], { headers: corsHeaders });
}

export async function POST(request) {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503, headers: corsHeaders });
    }
    try {
        const body = await request.json();
        const { folder, photos } = body;

        if (!folder || !photos || !photos.length) {
            return NextResponse.json({ error: 'Folder and photos required' }, { status: 400, headers: corsHeaders });
        }

        const safeFolder = folder.replace(/[^a-zA-Z0-9\-_]/g, '');
        const uploaded = [];

        for (const photo of photos) {
            const base64Data = photo.base64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const ext = (photo.filename.split('.').pop() || 'jpg');
            const filename = `${Date.now()}_${photo.filename}`;
            const contentType = `image/${ext}`;

            const url = await uploadToStorage(`events/${safeFolder}`, filename, buffer, contentType);

            // Also insert into event_photos table
            await supabase.from('event_photos').insert([{ folder: safeFolder, url, filename: photo.filename }]);

            uploaded.push(url);
        }

        return NextResponse.json({ uploaded }, { status: 201, headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}

export async function DELETE(request) {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503, headers: corsHeaders });
    }
    try {
        const body = await request.json();
        const filePath = body.path;
        if (!filePath) return NextResponse.json({ error: 'Path required' }, { status: 400, headers: corsHeaders });

        // Delete from Storage if it's a Supabase URL
        if (filePath.includes('supabase')) {
            try {
                const urlParts = filePath.split(`/${BUCKET}/`);
                if (urlParts[1]) await deleteFromStorage(decodeURIComponent(urlParts[1]));
            } catch (e) { console.warn('Failed to delete from Supabase:', e.message); }
        }

        // Delete from DB
        await supabase.from('event_photos').delete().eq('url', filePath);

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
