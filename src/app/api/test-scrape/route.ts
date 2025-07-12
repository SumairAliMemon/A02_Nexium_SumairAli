import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Test API: Starting...');
    
    const { url } = await request.json();
    console.log('Test API: URL received:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Just return a simple response for testing
    return NextResponse.json({
      success: true,
      data: {
        title: 'Test Title',
        summary: 'This is a test summary for the URL: ' + url,
        summary_urdu: 'یہ ایک ٹیسٹ خلاصہ ہے',
        full_text: 'This is the full test content.',
      },
    });

  } catch (error) {
    console.error('Test API: Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
