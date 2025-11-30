/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		return new Response('Hello World!');
// 	},
// } satisfies ExportedHandler<Env>;

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		const url = new URL(req.url);

		// 🔹 create link
		if (req.method === 'POST' && url.pathname === '/shorten') {
			const { code, url: longUrl } = await req.json();

			try {
				await env.DB.prepare('INSERT INTO links (code, url) VALUES (?, ?)').bind(code, longUrl).run();

				return Response.json({ ok: true });
			} catch {
				return Response.json({ error: 'Slug already taken' }, { status: 409 });
			}
		}

		// 🔹 redirect
		if (req.method === 'GET') {
			const code = url.pathname.slice(1);
			if (!code) return new Response('Not found', { status: 404 });

			const result = await env.DB.prepare('SELECT url FROM links WHERE code = ?').bind(code).first<{ url: string }>();

			if (!result) {
				return new Response('Not found', { status: 404 });
			}

			return Response.redirect(result.url, 301);
		}

		return new Response('Not found', { status: 404 });
	},
};

export interface Env {
	DB: D1Database;
}
