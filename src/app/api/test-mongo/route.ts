import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    return NextResponse.json({ success: true, message: 'MongoDB connection successful!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : error });
  }
}
