import { NextRequest, NextResponse } from 'next/server';
import { getMongoDb, isMongoDBConfigured } from '@/lib/mongodb';
import { FilmmakerType, UserProfile } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  if (!isMongoDBConfigured()) {
    return NextResponse.json({ 
      configured: false, 
      message: 'MongoDB Atlas not yet configured in .env' 
    });
  }

  try {
    const body = await request.json();
    const { action, email, password, fullName, filmmakerType, productionHouse, userId } = body;

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ configured: false, error: 'Database connection unavailable' }, { status: 500 });
    }

    const usersCol = db.collection('filmmaker_users');
    const profilesCol = db.collection('filmmaker_profiles');

    if (action === 'signup') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
      }

      const existing = await usersCol.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
      }

      const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const now = new Date().toISOString();

      await usersCol.insertOne({
        userId: newUserId,
        email: email.toLowerCase().trim(),
        password, // In hackathon/demo context, or hash with bcrypt if needed
        createdAt: now
      });

      const profile: UserProfile = {
        id: newUserId,
        email: email.toLowerCase().trim(),
        full_name: fullName || email.split('@')[0],
        avatar_url: null,
        filmmaker_type: (filmmakerType as FilmmakerType) || 'indie',
        production_house: productionHouse || null,
        created_at: now,
        updated_at: now
      };

      await profilesCol.insertOne(profile);

      return NextResponse.json({
        success: true,
        user: { id: newUserId, email: email.toLowerCase().trim() },
        profile
      });
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
      }

      const userDoc = await usersCol.findOne({ 
        email: email.toLowerCase().trim(),
        password
      });

      if (!userDoc) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      let profileDoc = await profilesCol.findOne({ id: userDoc.userId });
      if (!profileDoc) {
        // Auto-create basic profile
        const now = new Date().toISOString();
        const newProfile: UserProfile = {
          id: userDoc.userId,
          email: userDoc.email,
          full_name: userDoc.email.split('@')[0],
          avatar_url: null,
          filmmaker_type: 'indie',
          production_house: null,
          created_at: now,
          updated_at: now
        };
        await profilesCol.insertOne(newProfile);
        profileDoc = newProfile as any;
      }

      return NextResponse.json({
        success: true,
        user: { id: userDoc.userId, email: userDoc.email },
        profile: profileDoc
      });
    }

    if (action === 'updateProfile') {
      if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const updateData: Partial<UserProfile> = {
        updated_at: new Date().toISOString()
      };
      if (filmmakerType) updateData.filmmaker_type = filmmakerType as FilmmakerType;
      if (productionHouse !== undefined) updateData.production_house = productionHouse;
      if (fullName) updateData.full_name = fullName;

      await profilesCol.updateOne(
        { id: userId },
        { $set: updateData },
        { upsert: true }
      );

      const updated = await profilesCol.findOne({ id: userId });
      return NextResponse.json({ success: true, profile: updated });
    }

    if (action === 'getProfile') {
      if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      }

      const profile = await profilesCol.findOne({ id: userId });
      return NextResponse.json({ profile });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('MongoDB Auth API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
