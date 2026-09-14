import { NextResponse } from 'next/server';
import { parallelClient } from '@/lib/services/parallel';
import { geminiService } from '@/lib/services/gemini';
import { isMongoDBConfigured } from '@/lib/mongodb';
import { serpApiClient } from '@/lib/services/serpapi';

export async function GET() {
  const parallelConfigured = parallelClient.isConfigured();
  const geminiConfigured = geminiService.isConfigured();
  const mongodbConfigured = isMongoDBConfigured();
  const visualProvider = serpApiClient.getActiveProvider();
  const mode = parallelConfigured && geminiConfigured ? 'live' : 'demo';

  return NextResponse.json({
    status: 'ok',
    mode,
    modeLabel: mode === 'live' 
      ? 'Live Research - Gemini + Parallel Search' 
      : 'Demo Mode - simulated research data',
    providers: {
      parallel: {
        configured: parallelConfigured,
        name: 'Parallel Search API (api.parallel.ai/v1)',
        track: 'Parallel Partner Track'
      },
      gemini: {
        configured: geminiConfigured,
        name: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        track: 'Google Cloud Agent Track'
      },
      mongodb: {
        configured: mongodbConfigured,
        name: 'MongoDB Atlas Cloud Database',
        track: 'Persistence Layer'
      },
      visualIntelligence: {
        configured: visualProvider.configured,
        provider: visualProvider.id,
        name: visualProvider.name,
        track: 'Visual Intelligence'
      },
      // Backward compatibility key
      serpapi: {
        configured: visualProvider.configured,
        name: visualProvider.name,
        track: 'Visual Intelligence'
      }
    },
    version: '1.0.0'
  });
}
