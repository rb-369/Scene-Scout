import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb, isMongoDBConfigured } from '@/lib/mongodb';
import { LocationCandidate } from '@/lib/types';

export async function GET(request: NextRequest) {
  if (!isMongoDBConfigured()) {
    return NextResponse.json({ configured: false, locations: [] });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ configured: false, locations: [] });
    }

    const query = userId ? { userId } : {};
    const docs = await db.collection('saved_locations')
      .find(query)
      .sort({ savedAt: -1 })
      .toArray();

    const locations = docs.map(doc => doc.candidateData as LocationCandidate);
    return NextResponse.json({ configured: true, locations });
  } catch (err: any) {
    console.error('MongoDB GET saved locations error:', err);
    return NextResponse.json({ error: err.message, locations: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isMongoDBConfigured()) {
    return NextResponse.json({ configured: false, message: 'MongoDB Atlas not configured, saved locally' });
  }

  try {
    const body = await request.json();
    const { action, userId, candidate, locationId } = body;

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ configured: false });
    }

    const collection = db.collection('saved_locations');

    if (action === 'save') {
      if (!candidate || !candidate.id) {
        return NextResponse.json({ error: 'Missing candidate data' }, { status: 400 });
      }

      await collection.updateOne(
        { userId: userId || 'anonymous', locationId: candidate.id },
        {
          $set: {
            userId: userId || 'anonymous',
            locationId: candidate.id,
            candidateData: candidate,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            savedAt: new Date()
          }
        },
        { upsert: true }
      );

      return NextResponse.json({ success: true, action: 'saved' });
    } else if (action === 'remove') {
      if (!locationId) {
        return NextResponse.json({ error: 'Missing locationId' }, { status: 400 });
      }

      await collection.deleteOne({
        userId: userId || 'anonymous',
        locationId
      });

      return NextResponse.json({ success: true, action: 'removed' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('MongoDB POST saved locations error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
