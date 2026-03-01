import { NextResponse } from 'next/server';
import { supabase, uploadToStorage, deleteFromStorage, isSupabaseReady, BUCKET } from '@/lib/supabase';

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
    const { data, error } = await supabase.from('masters').select('*').order('name');
    if (error) {
        console.error('getMasters error:', error);
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
    return NextResponse.json(data || [], { headers: corsHeaders });
}

export async function POST(request) {
    if (!isSupabaseReady()) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 503, headers: corsHeaders });
    }
    try {
        const body = await request.json();

        let photoUrl = body.src || '';
        if (body.photoBase64 && body.photoFilename) {
            const base64Data = body.photoBase64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const ext = body.photoFilename.split('.').pop() || 'jpg';
            const filename = `${body.id || Date.now()}.${ext}`;
            const contentType = `image/${ext}`;
            photoUrl = await uploadToStorage('masters', filename, buffer, contentType);
        }

        const newMaster = {
            name: body.name || '',
            designation: body.designation || '',
            rank: body.rank || '',
            src: photoUrl,
            img: photoUrl,
            facePos: body.facePos || '50% 10%',
            quote: body.quote || '',
            bio: body.bio || '',
            achievements: body.achievements || [],
        };

        const { data, error } = await supabase.from('masters').insert([newMaster]).select();
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

        if (body.photoBase64 && body.photoFilename) {
            const base64Data = body.photoBase64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const ext = body.photoFilename.split('.').pop() || 'jpg';
            const filename = `${body.id}.${ext}`;
            const contentType = `image/${ext}`;
            const url = await uploadToStorage('masters', filename, buffer, contentType);
            body.src = url;
            body.img = url;
        }

        const { photoBase64, photoFilename, ...updateData } = body;
        const { data, error } = await supabase.from('masters').update(updateData).eq('id', body.id).select();
        if (error) throw error;
        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'Master not found' }, { status: 404, headers: corsHeaders });
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

        // Get master to find photo URL
        const { data: master } = await supabase.from('masters').select('src').eq('id', id).single();

        // Delete photo from storage if it's a Supabase URL
        if (master?.src && master.src.includes('supabase')) {
            try {
                const urlParts = master.src.split(`/${BUCKET}/`);
                if (urlParts[1]) await deleteFromStorage(decodeURIComponent(urlParts[1]));
            } catch (e) { console.warn('Failed to delete from storage:', e.message); }
        }

        const { error } = await supabase.from('masters').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
