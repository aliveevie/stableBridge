import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const response = await fetch("https://api.velar.co/tokens/?symbol=all", {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data, status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data); // Log the fetched data

    // Create a new response with the data
    const res = NextResponse.json(data);

    // Set CORS headers
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return res;
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 200 });

  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return res;
}