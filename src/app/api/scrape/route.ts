import clientPromise from '@/lib/mongodb';
import { scrapeWebpage } from '@/lib/scraper';
import { supabase } from '@/lib/supabase';
import { generateAISummary, translateToUrdu } from '@/lib/translator';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('API Route: Starting scrape request...');
    
    const { url } = await request.json();
    console.log('API Route: URL received:', url);

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    console.log('API Route: Starting webpage scraping...');
    // Scrape the webpage
    const scrapedContent = await scrapeWebpage(url);
    console.log('API Route: Scraping completed, title:', scrapedContent.title);

    console.log('API Route: Generating AI summary...');
    // Generate AI summary
    const summary = generateAISummary(scrapedContent.content);
    console.log('API Route: Summary generated');

    console.log('API Route: Translating to Urdu...');
    // Translate summary to Urdu
    const summaryUrdu = translateToUrdu(summary);
    console.log('API Route: Translation completed');

    console.log('API Route: Connecting to MongoDB...');
    // Save to MongoDB (full content)
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'blog_scraper');
    const collection = db.collection('blog_contents');
    console.log('API Route: MongoDB connected');

    const mongoResult = await collection.insertOne({
      url: scrapedContent.url,
      title: scrapedContent.title,
      content: scrapedContent.content,
      scraped_at: new Date(),
    });
    console.log('API Route: Data saved to MongoDB');

    console.log('API Route: Saving to Supabase...');
    // Save to Supabase (summary only)
    const { error: supabaseError } = await supabase
      .from('blog_summaries')
      .insert({
        url: scrapedContent.url,
        title: scrapedContent.title,
        summary: summary,
        summary_urdu: summaryUrdu,
        mongo_id: mongoResult.insertedId.toString(),
      })
      .select()
      .single();

    if (supabaseError) {
      console.error('API Route: Supabase error:', supabaseError);
      return NextResponse.json({ error: supabaseError.message || 'Failed to save summary', details: supabaseError }, { status: 500 });
    }
    console.log('API Route: Data saved to Supabase');

    console.log('API Route: Returning success response');
    return NextResponse.json({
      success: true,
      data: {
        title: scrapedContent.title,
        summary: summary,
        summary_urdu: summaryUrdu,
        full_text: scrapedContent.content,
      },
    });

  } catch (error) {
    console.error('API Route: Error processing request:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('API Route: Error name:', error.name);
      console.error('API Route: Error message:', error.message);
      console.error('API Route: Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
