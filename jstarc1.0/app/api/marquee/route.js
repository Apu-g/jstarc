import { NextResponse } from 'next/server';
import { supabase, isSupabaseReady } from '@/lib/supabase';

export async function GET() {
  if (!isSupabaseReady()) {
    return NextResponse.json({ updatedAt: 0, files: [] });
  }

  try {
    const { data, error } = await supabase.from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getGallery error:', error);
      return NextResponse.json({ updatedAt: 0, files: [] });
    }

    const files = (data || []).map(item => ({
      src: item.url,
      name: item.filename,
      id: item.id,
      size: 0,
      mtime: new Date(item.created_at).getTime(),
    }));

    return NextResponse.json(
      { updatedAt: Date.now(), files },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Marquee fetch error:', error);
    return NextResponse.json({ updatedAt: 0, files: [] });
  }
}
