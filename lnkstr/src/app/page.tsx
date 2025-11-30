'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')

  async function create() {
    setError('')
    setShortUrl('')

    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, slug: slug || undefined }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    setShortUrl(data.shortUrl)
  }

  return (
    <main className="mx-auto max-w-lg p-8 space-y-4">
      <Input
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Input
        placeholder="custom-slug (optional)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <Button onClick={create}>Shorten</Button>

      {error && <p className="text-red-500">{error}</p>}
      {shortUrl && (
        <p className="text-green-600 break-all">{shortUrl}</p>
      )}
    </main>
  )
}
