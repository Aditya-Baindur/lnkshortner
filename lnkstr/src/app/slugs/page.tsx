'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Link2 } from 'lucide-react';

type Slug = {
	code: string;
	url: string;
	shortUrl: string;
	clicks: number;
	createdAt: string;
};

export default function SlugsPage() {
	const [slugs, setSlugs] = useState<Slug[]>([]);
	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState<string | null>(null);

	useEffect(() => {
		fetch('/api/slug')
			.then((r) => r.json())
			.then((d) => setSlugs(d.slugs ?? []))
			.finally(() => setLoading(false));
	}, []);

	async function copy(text: string) {
		await navigator.clipboard.writeText(text);
		setCopied(text);
		setTimeout(() => setCopied(null), 1500);
	}

	return (
		<main className="min-h-screen bg-neutral-50 p-8">
			<Card className="mx-auto max-w-4xl">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Link2 className="h-5 w-5" />
						All Short Links
					</CardTitle>
					<CardDescription>Manage and inspect all existing slugs</CardDescription>
				</CardHeader>

				<CardContent>
					{loading && <p className="text-sm text-muted-foreground">Loading…</p>}

					{!loading && slugs.length === 0 && <p className="text-sm text-muted-foreground">No links created yet.</p>}

					{!loading && slugs.length > 0 && (
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b">
										<th className="text-left py-2">Slug</th>
										<th className="text-left">Destination</th>
										<th className="text-center">Clicks</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{slugs.map((s) => (
										<tr key={s.code} className="border-b last:border-0">
											<td className="py-2 font-mono">{s.code}</td>
											<td className="truncate max-w-xs">{s.url}</td>
											<td className="text-center">{s.clicks}</td>
											<td className="text-right">
												<Button variant="ghost" size="icon" onClick={() => copy(s.shortUrl)}>
													{copied === s.shortUrl ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>
		</main>
	);
}
