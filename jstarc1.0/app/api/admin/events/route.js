import { NextResponse } from 'next/server';
import { supabase, listStorageFiles, deleteFromStorage, isSupabaseReady } from '@/lib/supabase';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503, headers: corsHeaders });
    }

    const { data: events, error } = await supabase.from('events').select('*').order('date', { ascending: false });
    if (error) {
        console.error('getEvents error:', error);
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    // Add thumbnail image for each event from event_photos
    const eventsWithImages = await Promise.all((events || []).map(async (event) => {
        let image = '';
        try {
            const { data: photos } = await supabase.from('event_photos')
                .select('url')
                .eq('folder', event.folder)
                .limit(1);
            if (photos && photos.length > 0) {
                image = photos[0].url;
            }
        } catch (e) { /* ignore */ }

        // Fallback: try Supabase Storage directly
        if (!image) {
            try {
                const files = await listStorageFiles(`events/${event.folder}`);
                if (files && files.length > 0) image = files[0].src;
            } catch (e) { /* ignore */ }
        }

        return { ...event, image };
    }));

    return NextResponse.json(eventsWithImages, { headers: corsHeaders });
}

export async function POST(request) {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503, headers: corsHeaders });
    }
    try {
        const body = await request.json();

        const folder = (body.title || 'event')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_|_$/g, '');

        const newEvent = {
            title: body.title || '',
            date: body.date || 'Recent Event',
            location: body.location || 'JStarc Event',
            category: body.category || 'Gallery',
            folder: folder,
        };

        const { data, error } = await supabase.from('events').insert([newEvent]).select();
        if (error) throw error;

        return NextResponse.json(data[0], { status: 201, headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}

export async function PUT(request) {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503, headers: corsHeaders });
    }
    try {
        const body = await request.json();
        const { data, error } = await supabase.from('events').update(body).eq('id', body.id).select();
        if (error) throw error;
        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404, headers: corsHeaders });
        }

        return NextResponse.json(data[0], { headers: corsHeaders });
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
        const id = body.id;
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400, headers: corsHeaders });

        // Get event to find folder
        const { data: event } = await supabase.from('events').select('folder').eq('id', id).single();

        if (event?.folder) {
            // Delete photos from Supabase Storage
            try {
                const files = await listStorageFiles(`events/${event.folder}`);
                if (files && files.length > 0) {
                    for (const file of files) {
                        try {
                            await deleteFromStorage(`events/${event.folder}/${file.name}`);
                        } catch (e) { console.warn('Failed to delete file:', file.name); }
                    }
                }
            } catch (e) { console.warn('Failed to list files for cleanup:', e.message); }

            // Delete event_photos records
            await supabase.from('event_photos').delete().eq('folder', event.folder);
        }

        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
