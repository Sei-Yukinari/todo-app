import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function parseEnvFile(content: string) {
  const lines = content.split(/\r?\n/);
  const obj: Record<string, string> = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    obj[key] = val;
  }
  return obj;
}

function loadConfigFromFile(): Record<string, string> {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) return {};
    const content = fs.readFileSync(envPath, 'utf8');
    return parseEnvFile(content);
  } catch (e) {
    return {};
  }
}

export function GET() {
  const fromEnv = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  } as Record<string, string | undefined>;

  if (fromEnv.apiKey) {
    return NextResponse.json({ data: fromEnv });
  }

  // fallback: try reading .env.local directly
  const fileVars = loadConfigFromFile();
  const cfg = {
    apiKey: fileVars['NEXT_PUBLIC_FIREBASE_API_KEY'],
    authDomain: fileVars['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'],
    projectId: fileVars['NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
    appId: fileVars['NEXT_PUBLIC_FIREBASE_APP_ID'],
  } as Record<string, string | undefined>;

  return NextResponse.json({ data: cfg });
}
