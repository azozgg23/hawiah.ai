import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands/${brandId}`, {
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
