import { scrapeWebpage } from '@/lib/scraper';
import { generateAISummary, translateToUrdu } from '@/lib/translator';
import { NextRequest, NextResponse } from 'next/server';

// Test URLs that should work
const TEST_URLS = [
  'https://httpbin.org/html',
  'https://example.com',
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://www.google.com',
];

export async function POST(request: NextRequest) {
  try {
    console.log('Test Multiple URLs: Starting...');
    
    const { url } = await request.json();
    console.log('Test Multiple URLs: URL received:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Try the provided URL first
    const urlsToTry = [url, ...TEST_URLS];
    let lastError = null;
    
    for (const testUrl of urlsToTry) {
      try {
        console.log(`Test Multiple URLs: Trying URL: ${testUrl}`);
        
        // Try to scrape
        const scrapedContent = await scrapeWebpage(testUrl);
        console.log(`Test Multiple URLs: Successfully scraped: ${testUrl}`);
        
        // Generate summary and translation
        const summary = generateAISummary(scrapedContent.content);
        const summaryUrdu = translateToUrdu(summary);
        
        return NextResponse.json({
          success: true,
          data: {
            url: testUrl,
            title: scrapedContent.title,
            summary: summary,
            summary_urdu: summaryUrdu,
            full_text: scrapedContent.content.substring(0, 500) + '...',
            note: testUrl !== url ? `Original URL failed, used ${testUrl} instead` : 'Original URL worked'
          },
        });
        
      } catch (err) {
        console.log(`Test Multiple URLs: Failed for ${testUrl}:`, err instanceof Error ? err.message : 'Unknown error');
        lastError = err;
        continue;
      }
    }
    
    // If all URLs failed
    return NextResponse.json({ 
      error: 'All test URLs failed', 
      lastError: lastError instanceof Error ? lastError.message : 'Unknown error'
    }, { status: 500 });

  } catch (error) {
    console.error('Test Multiple URLs: Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
