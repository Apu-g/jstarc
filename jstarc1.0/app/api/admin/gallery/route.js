import { NextResponse } from 'next/server';
import { supabase, uploadToStorage, deleteFromStorage, isSupabaseReady, BUCKET } from '@/lib/supabase';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503, headers: corsHeaders });
    }

    const { data, error } = await supabase.from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('getGallery error:', error);
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    const files = (data || []).map(item => ({
        src: item.url,
        name: item.filename,
        id: item.id,
        size: 0,
        mtime: new Date(item.created_at).getTime(),
    }));

    return NextResponse.json({ updatedAt: Date.now(), files }, { headers: corsHeaders });
}

export async function POST(request) {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503, headers: corsHeaders });
    }
    try {
        const body = await request.json();
        const { photos } = body;

        if (!photos || !photos.length) {
            return NextResponse.json({ error: 'Photos required' }, { status: 400, headers: corsHeaders });
        }

        const uploaded = [];

        for (const photo of photos) {
            const base64Data = photo.base64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const ext = (photo.filename.split('.').pop() || 'jpg');
            const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
            const contentType = `image/${ext}`;

            const url = await uploadToStorage('gallery', filename, buffer, contentType);

            // Insert into gallery table
            const { data: insertData } = await supabase.from('gallery')
                .insert([{ url, filename }])
                .select();

            const entry = {
                src: url,
                size: buffer.length,
                mtime: Date.now(),
                name: filename,
            };

            uploaded.push(entry);
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
        const filename = body.filename;
        if (!filename) return NextResponse.json({ error: 'Filename required' }, { status: 400, headers: corsHeaders });

        // Delete from Storage
        try {
            await deleteFromStorage(`gallery/${filename}`);
        } catch (e) { console.warn('Failed to delete from storage:', e.message); }

        // Delete from DB
        const { error } = await supabase.from('gallery').delete().eq('filename', filename);
        if (error) throw error;

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
