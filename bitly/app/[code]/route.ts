/// <reference types="@cloudflare/workers-types" />

export const runtime = 'edge'

declare const DB: D1Database

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
): Promise<Response> {
  const result = await DB
    .prepare('SELECT url FROM links WHERE code = ?')
    .bind(params.code)
    .first<{ url: string }>()

  if (!result) {
    return new Response('Not found', { status: 404 })
  }

  return Response.redirect(result.url, 301)
}
