import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

const SLUG_REGEX = /^[a-zA-Z0-9_-]{3,32}$/
const RESERVED = ['api', 'admin', 'login', 'favicon.ico', 'robots.txt']

type ShortenBody = {
  url?: string
  slug?: string
}

export async function POST(
  req: Request,
  ctx: unknown
) {
  // ✅ Cloudflare Pages injects env at runtime
  const env = (ctx as { env: Env }).env

  // ✅ Explicit typing (this fixes your error)
  const body = (await req.json()) as ShortenBody
  const { url, slug } = body

  if (!url || !url.startsWith('http')) {
    return NextResponse.json(
      { error: 'Invalid URL' },
      { status: 400 }
    )
  }

  let code = slug?.trim()

  if (code) {
    if (!SLUG_REGEX.test(code)) {
      return NextResponse.json(
        { error: 'Invalid slug format' },
        { status: 400 }
      )
    }

    if (RESERVED.includes(code.toLowerCase())) {
      return NextResponse.json(
        { error: 'Slug is reserved' },
        { status: 400 }
      )
    }
  } else {
    code = nanoid(7)
  }

  try {
    await env.DB
      .prepare('INSERT INTO links (code, url) VALUES (?, ?)')
      .bind(code, url)
      .run()
  } catch {
    return NextResponse.json(
      { error: 'Slug already taken' },
      { status: 409 }
    )
  }

  return NextResponse.json({
    shortUrl: `${env.BASE_URL}/${code}`,
  })
}
