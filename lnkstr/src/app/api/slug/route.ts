// app/api/slugs/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/slugs`, {
		headers: {
			Authorization: `Bearer ${process.env.BITLY_API_KEY}`,
		},
		cache: 'no-store',
	});

	const data = await res.json();
	return NextResponse.json(data, { status: res.status });
}
