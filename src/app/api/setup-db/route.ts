import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create the blog_summaries table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('exec', { 
      command: `
        CREATE TABLE IF NOT EXISTS public.blog_summaries (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          url TEXT NOT NULL,
          title TEXT NOT NULL, 
          summary TEXT NOT NULL,
          summary_urdu TEXT NOT NULL,
          mongo_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (createTableError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create table programmatically. Please run the provided SQL in the Supabase dashboard.',
        sql: `
          CREATE TABLE IF NOT EXISTS public.blog_summaries (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            url TEXT NOT NULL,
            title TEXT NOT NULL, 
            summary TEXT NOT NULL,
            summary_urdu TEXT NOT NULL,
            mongo_id TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          ALTER TABLE public.blog_summaries ENABLE ROW LEVEL SECURITY;
          CREATE POLICY "Allow public read access" ON public.blog_summaries 
            FOR SELECT USING (true);
          CREATE POLICY "Allow public insert access" ON public.blog_summaries 
            FOR INSERT WITH CHECK (true);
        `
      }, { status: 500 });
    }

    // Enable Row Level Security
    await supabase.rpc('exec', { 
      command: 'ALTER TABLE public.blog_summaries ENABLE ROW LEVEL SECURITY;'
    });
    // Create policies
    await supabase.rpc('exec', { 
      command: `CREATE POLICY IF NOT EXISTS "Allow public read access" ON public.blog_summaries FOR SELECT USING (true);`
    });
    await supabase.rpc('exec', { 
      command: `CREATE POLICY IF NOT EXISTS "Allow public insert access" ON public.blog_summaries FOR INSERT WITH CHECK (true);`
    });

    // Insert sample data
    const { data, error: insertError } = await supabase
      .from('blog_summaries')
      .insert([
        {
          url: 'https://example.com/blog1',
          title: 'Sample Blog Post 1',
          summary: 'This is a summary of the first sample blog post.',
          summary_urdu: 'یہ پہلی نمونہ بلاگ پوسٹ کا خلاصہ ہے۔'
        },
        {
          url: 'https://example.com/blog2',
          title: 'Sample Blog Post 2',
          summary: 'This is a summary of the second sample blog post.',
          summary_urdu: 'یہ دوسری نمونہ بلاگ پوسٹ کا خلاصہ ہے۔'
        }
      ])
      .select();
    
    if (insertError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Error inserting sample data', 
        error: insertError 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database setup completed successfully!',
      data
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to set up database', 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
