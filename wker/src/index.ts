export interface Env {
	DB: D1Database;
	ADMIN_API_KEY: string;
}

export default {
	async fetch(req: Request, env: Env) {
		const url = new URL(req.url);

		// ----- AUTH FOR API ROUTES -----
		if (url.pathname.startsWith('/api')) {
			const auth = req.headers.get('authorization');
			if (auth !== `Bearer ${env.ADMIN_API_KEY}`) {
				return Response.json({ error: 'Unauthorized' }, { status: 401 });
			}
		}

		// ----- CREATE SHORT LINK -----
		if (req.method === 'POST' && url.pathname === '/api/shorten') {
			const body = await req.json<{ url: string; slug?: string }>();
			if (!body.url) {
				return Response.json({ error: 'URL required' }, { status: 400 });
			}

			const code = body.slug ?? crypto.randomUUID().slice(0, 6);

			try {
				await env.DB.prepare('INSERT INTO links (code, url) VALUES (?, ?)').bind(code, body.url).run();
			} catch {
				return Response.json({ error: 'Slug already exists' }, { status: 409 });
			}

			return Response.json({
				shortUrl: `${url.origin}/${code}`,
			});
		}

		// ----- REDIRECT -----
		if (req.method === 'GET' && url.pathname.length > 1) {
			const code = url.pathname.slice(1);

			const row = await env.DB.prepare('SELECT url FROM links WHERE code = ?').bind(code).first<{ url: string }>();

			if (!row) {
				return Response.json({ error: 'Not found' }, { status: 404 });
			}

			await env.DB.prepare('UPDATE links SET clicks = clicks + 1 WHERE code = ?').bind(code).run();

			return Response.redirect(row.url, 302);
		}

		return Response.json({ status: 'ok' });
	},
};
