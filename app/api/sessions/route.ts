import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb, isMongoDBConfigured } from '@/lib/mongodb';
import { ResearchSession } from '@/lib/types';

export async function GET(request: NextRequest) {
  if (!isMongoDBConfigured()) {
    return NextResponse.json({ configured: false, sessions: [] });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ configured: false, sessions: [] });
    }

    const query = userId ? { userId } : {};
    const docs = await db.collection('scout_sessions')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    const sessions = docs.map(doc => doc.sessionData as ResearchSession);
    return NextResponse.json({ configured: true, sessions });
  } catch (err: any) {
    console.error('MongoDB GET scout_sessions error:', err);
    return NextResponse.json({ error: err.message, sessions: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isMongoDBConfigured()) {
    return NextResponse.json({ configured: false, message: 'MongoDB Atlas not configured, saved locally' });
  }

  try {
    const body = await request.json();
    const { session, userId } = body;

    if (!session || !session.id) {
      return NextResponse.json({ error: 'Missing session data' }, { status: 400 });
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ configured: false });
    }

    await db.collection('scout_sessions').updateOne(
      { sessionId: session.id },
      {
        $set: {
          sessionId: session.id,
          userId: userId || 'anonymous',
          brief: session.userBrief,
          candidateCount: session.candidates?.length || 0,
          sessionData: session,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('MongoDB POST scout_sessions error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
