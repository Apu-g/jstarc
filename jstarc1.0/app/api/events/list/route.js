import { NextResponse } from 'next/server';
import { supabase, listStorageFiles, isSupabaseReady } from '@/lib/supabase';

export async function GET() {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    try {
        // Fetch events from DB
        const { data: events, error } = await supabase.from('events')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error listing events:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Add thumbnail image for each event
        const eventsWithImages = await Promise.all((events || []).map(async (event) => {
            let image = '';

            // Try event_photos DB table first
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

        return NextResponse.json({ events: eventsWithImages });
    } catch (error) {
        console.error('Error listing events:', error);
        return NextResponse.json({ error: 'Failed to list events' }, { status: 500 });
    }
}
