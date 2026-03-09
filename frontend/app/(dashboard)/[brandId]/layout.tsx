import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function getServerApiUrl(path: string) {
  const serverBase = process.env.NEXT_SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL

  if (!serverBase) {
    throw new Error('API base URL is not configured')
  }

  if (serverBase.startsWith('http://') || serverBase.startsWith('https://')) {
    const base = new URL(serverBase)
    const basePathname = base.pathname.replace(/\/+$/, '')
    const nextPathname = path.replace(/^\/+/, '')

    base.pathname = [basePathname, nextPathname].filter(Boolean).join('/') || '/'
    return base.toString()
  }

  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host')
  const protocol = requestHeaders.get('x-forwarded-proto') || 'http'

  if (!host) {
    throw new Error('Request host is unavailable for server-side API call')
  }

  const normalizedBase = serverBase.replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '')

  return new URL(`${normalizedBase}/${normalizedPath}`, `${protocol}://${host}`).toString()
}

async function ensureBrandAccess(brandId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!user || !session?.access_token) {
    redirect('/login')
  }

  const apiUrl = await getServerApiUrl(`/brands/${brandId}`)

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: 'no-store',
  })

  if (response.status === 404) {
    notFound()
  }

  if (response.status === 401) {
    redirect('/login')
  }

  if (!response.ok) {
    throw new Error('Failed to load brand')
  }
}

export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { brandId: string }
}) {
  const { brandId } = params

  await ensureBrandAccess(brandId)

  const navLinks = [
    { href: `/${brandId}`, label: 'Generator' },
    { href: `/${brandId}/kit`, label: 'Brand Kit' },
    { href: `/${brandId}/keys`, label: 'Keys' },
    { href: `/${brandId}/history`, label: 'History' },
    { href: `/${brandId}/settings`, label: 'Settings' },
  ]

  return (
    <div>
      <div className="mb-6 flex gap-4 border-b pb-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  )
}
