export interface Env {
	DB: D1Database;
	ADMIN_API_KEY: string;
	ABK: string;
	PUBLIC_BASE_URL: string;
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

		// ----- GET ALL SLUGS -----
		if (req.method === 'GET' && url.pathname === '/api/slugs') {
			const { results } = await env.DB.prepare(
				`
						SELECT 
							id,
							code,
							url,
							clicks,
							created_at
						FROM links
						ORDER BY created_at DESC
					`
			).all();

			return Response.json({
				slugs: results.map((r) => ({
					id: r.id,
					code: r.code,
					url: r.url,
					shortUrl: `${env.PUBLIC_BASE_URL}/${r.code}`,
					clicks: r.clicks,
					createdAt: r.created_at,
				})),
			});
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
				shortUrl: `${env.PUBLIC_BASE_URL}/${code}`,
			});
		}

		// ----- DELETE SHORT LINK -----
		if (req.method === 'POST' && url.pathname === '/api/delete') {
			const body = await req.json<{ code?: string }>();

			if (!body.code) {
				return Response.json({ error: 'Slug code required' }, { status: 400 });
			}

			const result = await env.DB.prepare('DELETE FROM links WHERE code = ?').bind(body.code).run();

			if (result.meta.changes === 0) {
				return Response.json({ error: 'Slug not found' }, { status: 404 });
			}

			return Response.json({ success: true });
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
