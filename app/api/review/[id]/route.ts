import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id || id.length !== 24) {
      return NextResponse.json({ success: false, error: 'Invalid Review ID' }, { status: 400 });
    }

    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
    }

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    console.error('Fetch Review API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}
