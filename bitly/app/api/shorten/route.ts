import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

const SLUG_REGEX = /^[a-zA-Z0-9_-]{3,32}$/
const RESERVED = ['api', 'admin', 'login', 'favicon.ico', 'robots.txt']

type ShortenBody = {
  url?: string
  slug?: string
}

export async function POST(req: Request) {
  const body = (await req.json()) as ShortenBody
  const { url, slug } = body

  if (!url || !url.startsWith('http')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
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

  const res = await fetch(`${process.env.SHORTENER_API}/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, url }),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  return NextResponse.json({
    shortUrl: `${process.env.BASE_URL}/${code}`,
  })
}
