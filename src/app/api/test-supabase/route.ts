import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase.from('blog_summaries').select('*').limit(1);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Supabase connection successful!', data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : error });
  }
}
