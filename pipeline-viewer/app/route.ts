import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authed = request.cookies.get('auth')?.value === process.env.AUTH_SECRET;
  if (!authed) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  const html = await readFile(join(process.cwd(), 'content/pipeline.html'), 'utf-8');
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
