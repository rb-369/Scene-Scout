import { NextRequest, NextResponse } from 'next/server';
import { serpApiClient } from '@/lib/services/serpapi';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const city = searchParams.get('city') || 'Mumbai';

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Location name is required' },
        { status: 400 }
      );
    }

    const photoResult = await serpApiClient.getPlacePhoto(name, city);

    return NextResponse.json({
      success: true,
      configured: serpApiClient.isConfigured(),
      data: photoResult
    });
  } catch (err: any) {
    console.error('[API /api/place-photo] Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch place photo' },
      { status: 500 }
    );
  }
}
