import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 5; // Show 5 full texts per page
    const offset = (page - 1) * limit;

    // Get full texts from MongoDB with pagination
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'blog_scraper');
    const collection = db.collection('blog_contents');

    const totalCount = await collection.countDocuments();
    const fullTexts = await collection
      .find({})
      .sort({ scraped_at: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        full_texts: fullTexts,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_count: totalCount,
          per_page: limit,
        },
      },
    });

  } catch (error) {
    console.error('Error fetching full texts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
