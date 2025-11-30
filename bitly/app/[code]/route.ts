export async function GET(
  req: Request,
  { params }: { params: { code: string } },
  env: Env
) {
  const result = await env.DB
    .prepare('SELECT url FROM links WHERE code = ?')
    .bind(params.code)
    .first<{ url: string }>()

  if (!result) {
    return new Response('Not found', { status: 404 })
  }

  return Response.redirect(result.url, 301)
}
