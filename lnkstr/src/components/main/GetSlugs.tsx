'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Check, Copy, Loader2, Link } from 'lucide-react';

export default function Home() {
	const [getSlug, setgetSlug] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);

	async function create() {
		setError('');
		setgetSlug('');
		setCopied(false);
		setLoading(true);

		const res = await fetch('/api/shorten', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});

		const data = await res.json();
		setLoading(false);

		if (!res.ok) {
			setError(data?.error ?? 'Something went wrong');
			return;
		}

		setgetSlug(data.getSlug);
	}

	async function copy() {
		await navigator.clipboard.writeText(getSlug);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
			<Card className="w-full max-w-lg shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Link className="h-5 w-5 text-neutral-600" />
						Get all the slugs
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Error */}
					{error && <p className="text-sm text-red-600">{error}</p>}

					{/* Success */}
					{getSlug && (
						<div className="rounded-md border bg-green-50 p-3 flex items-center justify-between gap-2">
							<p className="text-sm text-green-700 break-all">{getSlug}</p>
							<Button variant="ghost" size="icon" onClick={copy}>
								{copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
							</Button>
						</div>
					)}
				</CardContent>

				<CardFooter>
					<Button className="w-full" onClick={create} disabled={loading}>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Shorten URL
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
