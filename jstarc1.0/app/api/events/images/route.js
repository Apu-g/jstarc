import { NextResponse } from 'next/server';
import { supabase, listStorageFiles, isSupabaseReady } from '@/lib/supabase';

export async function GET(request) {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');

    if (!folder) {
        return NextResponse.json({ error: 'Folder name required' }, { status: 400 });
    }

    const safeFolder = folder.replace(/[^a-zA-Z0-9\-_]/g, '');

    // Try event_photos DB table first
    const { data: photos } = await supabase.from('event_photos')
        .select('url')
        .eq('folder', safeFolder);

    if (photos && photos.length > 0) {
        return NextResponse.json({ images: photos.map(p => p.url) });
    }

    // Fallback: list from Supabase Storage directly
    try {
        const files = await listStorageFiles(`events/${safeFolder}`);
        if (files && files.length > 0) {
            return NextResponse.json({ images: files.map(f => f.src) });
        }
    } catch (e) {
        console.warn('Supabase storage fetch failed:', e.message);
    }

    return NextResponse.json({ images: [] });
}
