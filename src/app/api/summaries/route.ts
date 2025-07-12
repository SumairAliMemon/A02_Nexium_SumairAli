import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 5; // Show 5 summaries per page
    const offset = (page - 1) * limit;

    // Get summaries from Supabase with pagination
    const { data: summaries, error, count } = await supabase
      .from('blog_summaries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch summaries' }, { status: 500 });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      data: {
        summaries: summaries || [],
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_count: count || 0,
          per_page: limit,
        },
      },
    });

  } catch (error) {
    console.error('Error fetching summaries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
