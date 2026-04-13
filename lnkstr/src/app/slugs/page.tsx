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
		<main className="relative min-h-screen bg-slate-950 text-slate-50 [--theme:#0ea5e9] [--theme-soft:rgba(14,165,233,0.14)]">
			<div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
				<div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_20%_20%,var(--theme-soft),transparent_40%)]" />
				<div className="absolute inset-x-0 top-20 h-64 bg-[radial-gradient(circle_at_80%_10%,rgba(15,23,42,0.8),transparent_35%)]" />
				<div className="absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(circle_at_50%_100%,rgba(15,23,42,0.9),transparent_45%)]" />
			</div>

			<div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
				<header className="flex items-start justify-between gap-4">
					<div className="space-y-2">
						<p className="text-sm uppercase tracking-[0.2em] text-slate-400">Link Studio</p>
						<h1 className="text-3xl font-semibold tracking-tight text-slate-50">Manage your short links</h1>
						<p className="max-w-2xl text-sm text-slate-400">
							Inspect every slug at a glance, copy ready-made URLs, and keep tabs on engagement without leaving the page.
						</p>
					</div>

					<div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 shadow-lg shadow-slate-900/30 backdrop-blur">
						<span className="mr-1 text-[var(--theme)]">{slugs.length}</span>
						active {slugs.length === 1 ? 'link' : 'links'}
					</div>
				</header>

				<Card className="border border-white/10 bg-slate-900/80 shadow-2xl shadow-slate-900/40 backdrop-blur">
					<CardHeader className="border-b border-white/5">
						<CardTitle className="flex items-center gap-2 text-lg">
							<span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--theme-soft)]">
								<Link2 className="h-4 w-4 text-[var(--theme)]" />
							</span>
							All Short Links
						</CardTitle>
						<CardDescription className="text-slate-400">Clean, compact overview of every destination and its performance.</CardDescription>
					</CardHeader>

					<CardContent className="p-0">
						{loading && (
							<div className="space-y-3 px-6 py-5">
								{Array.from({ length: 4 }).map((_, idx) => (
									<div key={idx} className="h-10 rounded-lg bg-white/5" />
								))}
							</div>
						)}

						{!loading && slugs.length === 0 && (
							<div className="px-6 py-8 text-sm text-slate-400">No links created yet. Start shortening to see them appear here.</div>
						)}

						{!loading && slugs.length > 0 && (
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead className="text-left text-slate-300">
										<tr className="border-b border-white/5">
											<th className="px-6 py-3 font-medium">Slug</th>
											<th className="px-3 py-3 font-medium">Destination</th>
											<th className="px-3 py-3 text-center font-medium">Clicks</th>
											<th className="px-6 py-3 text-right font-medium">Copy</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-white/5">
										{slugs.map((s) => (
											<tr key={s.code} className="transition hover:bg-white/5">
												<td className="px-6 py-3">
													<div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
														<span className="h-2 w-2 rounded-full bg-[var(--theme)]" />
														{s.code}
													</div>
													<div className="mt-1 text-[11px] text-slate-500">{s.shortUrl}</div>
												</td>
												<td className="max-w-xs px-3 py-3">
													<a
														href={s.url}
														target="_blank"
														rel="noreferrer"
														className="block max-w-xs break-words text-slate-200 underline-offset-4 hover:text-[var(--theme)] hover:underline"
													>
														{s.url}
													</a>
												</td>
												<td className="px-3 py-3 text-center font-semibold text-slate-100">{s.clicks}</td>
												<td className="px-6 py-3 text-right">
													<Button
														variant="ghost"
														size="icon"
														className="h-9 w-9 rounded-full text-[var(--theme)] hover:bg-[var(--theme-soft)]"
														onClick={() => copy(s.shortUrl)}
													>
														{copied === s.shortUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
			</div>
		</main>
	);
}
