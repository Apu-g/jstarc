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
    const { data, error } = await supabase.from('blackbelts').select('*').order('name');
    if (error) {
        console.error('getBlackbelts error:', error);
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

        let photoUrl = body.img || '';
        if (body.photoBase64 && body.photoFilename) {
            const base64Data = body.photoBase64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const ext = body.photoFilename.split('.').pop() || 'jpg';
            const filename = `${body.id || Date.now()}.${ext}`;
            const contentType = `image/${ext}`;
            photoUrl = await uploadToStorage('blackbelts', filename, buffer, contentType);
        }

        const newMember = {
            name: body.name || '',
            rank: body.rank || 'Black Belt',
            desc: body.desc || 'Black Belt',
            img: photoUrl,
            facePos: body.facePos || '50% 15%',
            achievements: body.achievements || [],
            bio: body.bio || 'A dedicated martial artist on the path of excellence.',
        };

        const { data, error } = await supabase.from('blackbelts').insert([newMember]).select();
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
            body.img = await uploadToStorage('blackbelts', filename, buffer, contentType);
        }

        const { photoBase64, photoFilename, ...updateData } = body;
        const { data, error } = await supabase.from('blackbelts').update(updateData).eq('id', body.id).select();
        if (error) throw error;
        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404, headers: corsHeaders });
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

        // Get member to find photo URL
        const { data: member } = await supabase.from('blackbelts').select('img').eq('id', id).single();

        // Delete photo from storage if it's a Supabase URL
        if (member?.img && member.img.includes('supabase')) {
            try {
                const urlParts = member.img.split(`/${BUCKET}/`);
                if (urlParts[1]) await deleteFromStorage(decodeURIComponent(urlParts[1]));
            } catch (e) { console.warn('Failed to delete from storage:', e.message); }
        }

        const { error } = await supabase.from('blackbelts').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true }, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
}
