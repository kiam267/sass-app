// pages/api/add-domain.ts
import { addDomainToVercel } from '@/lib/vercel-domain';
import { NextRequest, NextResponse } from 'next/server';

export default async function GET(req: NextRequest) {
  // const { domain } = await req.json();
  // const result = await addDomainToVercel(domain);
  return NextResponse.json('work', { status: 200 });
}
