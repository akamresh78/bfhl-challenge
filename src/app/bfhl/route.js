import { NextResponse } from 'next/server';
import { processGraphData } from '@/lib/graphProcessor';

const USER_ID = "Amreshkant_05062005";
const EMAIL_ID = "ak5318@srmist.edu.in";
const ROLL_NUMBER = "RA2311033010078";

function setCorsHeaders(res) {
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = body.data;

    const { hierarchies, invalid_entries, duplicate_edges, summary } = processGraphData(data);

    const response = NextResponse.json({
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: ROLL_NUMBER,
      hierarchies,
      invalid_entries,
      duplicate_edges,
      summary
    });
    
    return setCorsHeaders(response);

  } catch (err) {
    const response = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    return setCorsHeaders(response);
  }
}
