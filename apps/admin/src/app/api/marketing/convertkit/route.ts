import { NextResponse } from 'next/server';
import { getAllConvertKitData } from '../../../../lib/services/convertkit';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json(
      { status: 'unavailable', error: 'Missing required "from" and "to" query parameters' },
      { status: 400 },
    );
  }

  const result = await getAllConvertKitData(from, to);
  return NextResponse.json(result);
}
