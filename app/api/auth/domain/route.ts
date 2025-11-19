// pages/api/add-domain.ts
import { addDomainToVercel } from '@/lib/vercel-domain';
import { NextRequest, NextResponse } from 'next/server';
// import fetch from 'node-fetch';

interface VercelDomainResponse {
  name: string;
  apexName: string;
  verified: boolean;
  verification?: Array<{
    type: string;
    domain: string;
    value: string;
    reason: string;
  }>;
}

const VERCEL_API_TOKEN =
  process.env.NEXT_PUBLIC_VERCEL_API_TOKEN!;
const VERCEL_PROJECT_ID =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || null; // optional

const getVercelHeaders = () => ({
  Authorization: `Bearer ${VERCEL_API_TOKEN}`,
  'Content-Type': 'application/json',
});

const getApiUrl = (endpoint: string) => {
  const base = 'https://api.vercel.com';

  if (VERCEL_TEAM_ID) {
    return `${base}${endpoint}${
      endpoint.includes('?') ? '&' : '?'
    }teamId=${VERCEL_TEAM_ID}`;
  }

  return `${base}${endpoint}`;
};
export async function GET(req: NextRequest) {
  // const { domain } = await req.json();
  try {
    const res = await fetch(
      getApiUrl(
        `/v10/projects/${VERCEL_PROJECT_ID}/domains/reviewaide.com/verify`
      ),
      {
        method: 'GET',
        headers: getVercelHeaders(),
      }
    );

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error:
          data.error?.message ||
          'Failed to load domain config',
      });
    }

    return NextResponse.json({
      success: true,
      data: data as VercelDomainResponse,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Unknown error',
    });
  }
}
export async function POST(req: NextRequest) {
  const { domain } = await req.json();
  try {
    const res = await fetch(
      `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VERCEL_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: domain }),
      }
    );

    const data = await res.json();
    console.log(res.json(), 'vercel error ');

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: res,
      });
    }

    return {
      success: true,
      data: data as VercelDomainResponse,
    };
  } catch (err) {
    console.log(err);

    return NextResponse.json({
      success: false,
      error:
        err instanceof Error
          ? err.message
          : 'Unknown error',
    });
  }

  // return NextResponse.json('work', { status: 200 });
}
