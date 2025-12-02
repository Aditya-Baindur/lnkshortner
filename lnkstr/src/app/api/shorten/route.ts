import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.json();

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/shorten`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.BITLY_API_KEY}`,
		},
		body: JSON.stringify(body),
	});

	const data = await res.json();
	return new Response(JSON.stringify(data), {
		status: res.status,
	});
}
