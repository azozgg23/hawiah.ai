'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useBrand } from '@/hooks/use-brand'

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const brandId = Array.isArray(params.brandId) ? params.brandId[0] : params.brandId ?? ''
  const { brand, loading, error } = useBrand(brandId)

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>
  }

  if (error || !brand) {
    return <p className="text-red-600">Brand not found</p>
  }

  const navLinks = [
    { href: `/${brand.id}`, label: 'Generator' },
    { href: `/${brand.id}/kit`, label: 'Brand Kit' },
    { href: `/${brand.id}/keys`, label: 'Keys' },
    { href: `/${brand.id}/history`, label: 'History' },
    { href: `/${brand.id}/settings`, label: 'Settings' },
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
