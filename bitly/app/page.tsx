'use client'
import { useState } from 'react'

type ShortenSuccess = {
  shortUrl: string
}

type ShortenError = {
  error: string
}

type ShortenResponse = ShortenSuccess | ShortenError

export default function Home() {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [short, setShort] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!url) return

    setLoading(true)
    setError('')
    setShort('')

    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, slug: slug || undefined }),
    })

    const data =
      (await res.json().catch(() => null)) as ShortenResponse | null

    setLoading(false)

    // ✅ Narrow FIRST
    if (!data || 'error' in data) {
      setError(
        data && 'error' in data
          ? data.error
          : 'Something went wrong'
      )
      return
    }

    // ✅ TS now KNOWS this is ShortenSuccess
    setShort(data.shortUrl)
  }

  return (
    <main className="space-y-4 p-10 max-w-xl mx-auto">
      <input
        placeholder="https://example.com"
        className="border p-2 w-full"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />

      <input
        placeholder="Custom slug (optional)"
        className="border p-2 w-full"
        value={slug}
        onChange={e => setSlug(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="border px-4 py-2"
      >
        {loading ? 'Creating…' : 'Create'}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {short && (
        <a
          href={short}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 block"
        >
          {short}
        </a>
      )}
    </main>
  )
}
