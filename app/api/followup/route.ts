import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/services/gemini';
import { LocationCandidate } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body.prompt?.trim();
    const candidates: LocationCandidate[] = body.candidates || [];
    const brief: string = body.brief || '';
    const messages = body.messages || [];

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = await geminiService.handleFollowUp(prompt, candidates, brief, messages);

    return NextResponse.json({
      success: true,
      text: result.text,
      actionTaken: result.actionTaken,
      reRankedCandidates: result.reRankedCandidates
    });
  } catch (err: any) {
    console.error('[API /api/followup] Exception:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Follow-up reasoning failed'
    }, { status: 500 });
  }
}
