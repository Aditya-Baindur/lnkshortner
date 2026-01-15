'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  Copy,
  Loader2,
  Settings,
  Link as LinkIcon,
} from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function Home() {
  const [url, setUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function create() {
    if (loading) return

    if (!/^https?:\/\//i.test(url)) {
      setError('Please enter a valid URL starting with http or https')
      return
    }

    try {
      setError('')
      setShortUrl('')
      setCopied(false)
      setLoading(true)

      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          slug: slug.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error ?? 'Something went wrong')
      }

      setShortUrl(data.shortUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    if (!shortUrl) return
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="flex h-14 items-center border-b bg-white px-6">
        <Link
          href="/slugs"
          className="flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900"
        >
          <Settings className="h-4 w-4" />
          Slugs
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-neutral-600" />
              Simple URL Shortener
            </CardTitle>
            <CardDescription>
              Create clean, shareable short links in seconds.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* URL */}
            <div className="space-y-1">
              <Label htmlFor="url">Long URL</Label>
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <Label htmlFor="slug">
                Custom Slug{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="slug"
                placeholder="my-link"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {/* Success */}
            {shortUrl && (
              <div className="flex items-center justify-between gap-2 rounded-md border bg-green-50 p-3">
                <p className="break-all text-sm text-green-700">
                  {shortUrl}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copy}
                  aria-label="Copy short URL"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              onClick={create}
              disabled={loading}
            >
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Shorten URL
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
