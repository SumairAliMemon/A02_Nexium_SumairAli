import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// All code has been removed for cleanup.
}
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('DB Test: Testing Supabase connection...');
    
    // Test the connection by calling version RPC
    const { data: version, error } = await supabase.rpc('version');
    
    if (error) {
      console.error('DB Test: Supabase connection failed:', error);
      return NextResponse.json({ error: 'Database connection failed', details: error }, { status: 500 });
    }
    
    console.log('DB Test: Supabase connected successfully, version:', version);
    
    // Test inserting a record
    const { data: insertData, error: insertError } = await supabase
      .from('blog_summaries')
      .insert({
        url: 'https://test.com',
        title: 'Test Title',
        summary: 'Test Summary',
        summary_urdu: 'ٹیسٹ خلاصہ',
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('DB Test: Insert failed:', insertError);
      return NextResponse.json({ 
        error: 'Database insert failed', 
        details: insertError,
        suggestion: 'Please run the setup_database.sql script in your Supabase dashboard'
      }, { status: 500 });
    }
    
    console.log('DB Test: Insert successful:', insertData);
    
    // Clean up the test record
    await supabase
      .from('blog_summaries')
      .delete()
      .eq('id', insertData.id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection and table structure verified',
      data: insertData
    });
    
  } catch (error) {
    console.error('DB Test: Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
