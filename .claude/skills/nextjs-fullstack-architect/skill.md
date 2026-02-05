---
name: nextjs-fullstack-architect
description: Advanced Next.js full-stack development skill for building scalable, performant applications with App Router, Server Components, API routes, database integration, authentication, and deployment optimization.
author: SellerFin Team
license: MIT
---

# Next.js Full-Stack Architect

Comprehensive skill for architecting and building production-ready Next.js applications with modern patterns, performance optimization, and scalability considerations. Specializes in App Router, Server Components, and full-stack development patterns.

## Core Architecture Principles

### 1. App Router & Server Components
- Server-first architecture design
- Client/Server boundary optimization
- Streaming and Suspense patterns
- Layout and page composition
- Route group organization
- Parallel routes and intercepting routes

### 2. Data Fetching Strategies
- Server-side data fetching
- Client-side data fetching
- Static generation optimization
- Incremental Static Regeneration (ISR)
- Real-time data with Server-Sent Events
- Optimistic updates

### 3. Performance Optimization
- Bundle size optimization
- Image optimization strategies
- Font optimization
- Core Web Vitals optimization
- Memory leak prevention
- Lazy loading patterns

### 4. Security & Authentication
- Authentication patterns
- Authorization strategies
- CSRF protection
- Content Security Policy (CSP)
- Secure headers configuration
- API rate limiting

## Project Structure

### App Router Organization
```
app/
├── (auth)/                    # Route group for auth pages
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── layout.tsx            # Auth-specific layout
├── (dashboard)/              # Route group for authenticated pages
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── listings/
│   │   ├── page.tsx
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   │   ├── edit/
│   │   │   │   └── page.tsx
│   │   │   └── loading.tsx
│   │   └── new/
│   │       └── page.tsx
│   ├── deals/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── @messages/     # Parallel route for messages
│   │           └── page.tsx
│   └── layout.tsx            # Dashboard layout with navigation
├── api/                      # API routes
│   ├── auth/
│   │   └── route.ts
│   ├── listings/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   └── deals/
│       └── route.ts
├── globals.css
├── layout.tsx               # Root layout
├── loading.tsx             # Global loading UI
├── error.tsx              # Global error UI
├── not-found.tsx         # 404 page
└── page.tsx             # Homepage
```

### Library Organization
```
lib/
├── auth/
│   ├── config.ts           # NextAuth configuration
│   ├── providers.ts        # Auth providers
│   └── middleware.ts       # Auth middleware
├── database/
│   ├── connection.ts       # Database connection
│   ├── models/            # Database models
│   ├── migrations/        # Database migrations
│   └── seeds/            # Database seeds
├── api/
│   ├── client.ts          # API client configuration
│   ├── types.ts           # API type definitions
│   └── endpoints/         # API endpoint definitions
├── utils/
│   ├── validation.ts      # Form validation schemas
│   ├── formatting.ts      # Data formatting utilities
│   ├── constants.ts       # Application constants
│   └── helpers.ts         # Helper functions
├── hooks/
│   ├── use-api.ts         # API hooks
│   ├── use-auth.ts        # Authentication hooks
│   └── use-local-storage.ts
└── stores/
    ├── auth-store.ts      # Authentication state
    ├── ui-store.ts        # UI state management
    └── data-store.ts      # Application data state
```

## Server Components Patterns

### Data Fetching in Server Components
```typescript
// app/listings/page.tsx
import { Suspense } from 'react'
import { getListings } from '@/lib/api/listings'
import { ListingCard } from '@/components/listing-card'
import { ListingsSkeleton } from '@/components/skeletons'

interface SearchParams {
  industry?: string
  priceRange?: string
  location?: string
  page?: string
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Business Listings</h1>

      <Suspense fallback={<ListingsSkeleton />}>
        <ListingsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function ListingsContent({ searchParams }: { searchParams: SearchParams }) {
  const listings = await getListings({
    industry: searchParams.industry,
    priceRange: searchParams.priceRange,
    location: searchParams.location,
    page: Number(searchParams.page) || 1,
    limit: 20
  })

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No listings found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
```

### Streaming with Suspense
```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { DashboardMetrics } from '@/components/dashboard-metrics'
import { RecentActivity } from '@/components/recent-activity'
import { DealsPipeline } from '@/components/deals-pipeline'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Fast-loading metrics */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Independent loading states */}
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity />
        </Suspense>

        <Suspense fallback={<PipelineSkeleton />}>
          <DealsPipeline />
        </Suspense>
      </div>
    </div>
  )
}
```

## API Route Patterns

### RESTful API Design
```typescript
// app/api/listings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/database'
import { rateLimit } from '@/lib/rate-limit'

const createListingSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(10),
  askingPrice: z.number().positive(),
  industry: z.string(),
  revenue: z.number().nonnegative(),
  cashFlow: z.number()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const page = Number(searchParams.get('page')) || 1
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 50)

    const where: any = {
      status: 'ACTIVE'
    }

    if (industry) {
      where.industry = industry
    }

    if (priceMin || priceMax) {
      where.askingPrice = {}
      if (priceMin) where.askingPrice.gte = Number(priceMin)
      if (priceMax) where.askingPrice.lte = Number(priceMax)
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          seller: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          _count: {
            select: {
              savedBy: true,
              inquiries: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.listing.count({ where })
    ])

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    await rateLimit(request)

    // Authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validation
    const body = await request.json()
    const validatedData = createListingSchema.parse(body)

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        ...validatedData,
        sellerId: session.user.id,
        status: 'DRAFT'
      },
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Dynamic API Routes
```typescript
// app/api/listings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
            createdAt: true
          }
        },
        financials: true,
        documents: true,
        inquiries: {
          include: {
            buyer: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check if user has access to view this listing
    const session = await auth()
    const isOwner = session?.user?.id === listing.sellerId
    const isPublicListing = listing.status === 'ACTIVE'

    if (!isPublicListing && !isOwner) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Filter sensitive data for non-owners
    if (!isOwner) {
      delete (listing as any).financials
      delete (listing as any).documents
      delete (listing as any).inquiries
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { sellerId: true }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.sellerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error('Error updating listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Authentication & Authorization

### NextAuth.js Configuration
```typescript
// lib/auth/config.ts
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/database'
import { verify } from 'argon2'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !await verify(user.passwordHash, credentials.password)) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error'
  }
}
```

### Middleware for Route Protection
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Redirect to login if accessing protected routes without auth
    if (pathname.startsWith('/dashboard') && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Role-based access control
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Redirect authenticated users from auth pages
    if ((pathname === '/login' || pathname === '/register') && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ]
}
```

## Performance Optimization

### Image Optimization
```typescript
// components/optimized-image.tsx
import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false,
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={() => setImageError(true)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### Bundle Optimization
```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@headlessui/react'
    ],
    serverComponentsExternalPackages: ['bcrypt', 'argon2']
  },
  images: {
    domains: ['images.unsplash.com', 's3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
    return config
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true
  }
}

export default nextConfig
```

## Database Integration Patterns

### Prisma Schema Design
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  firstName     String?
  lastName      String?
  role          Role      @default(BUYER)
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  listings      Listing[]
  inquiries     Inquiry[]
  savedListings SavedListing[]
  dealRooms     DealRoom[]

  @@map("users")
}

model Listing {
  id          String        @id @default(cuid())
  title       String
  description String
  askingPrice Decimal       @db.Decimal(15, 2)
  revenue     Decimal       @db.Decimal(15, 2)
  cashFlow    Decimal       @db.Decimal(15, 2)
  industry    String
  status      ListingStatus @default(DRAFT)
  sellerId    String
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Relations
  seller        User           @relation(fields: [sellerId], references: [id])
  financials    Financial[]
  documents     Document[]
  inquiries     Inquiry[]
  savedBy       SavedListing[]
  dealRooms     DealRoom[]

  @@map("listings")
}

enum Role {
  BUYER
  SELLER
  ADMIN
}

enum ListingStatus {
  DRAFT
  ACTIVE
  PENDING
  SOLD
  ARCHIVED
}
```

### Database Service Layer
```typescript
// lib/database/listing-service.ts
import { prisma } from './connection'
import { Prisma } from '@prisma/client'

export class ListingService {
  static async getListings(filters: {
    industry?: string
    priceMin?: number
    priceMax?: number
    location?: string
    page?: number
    limit?: number
  }) {
    const {
      industry,
      priceMin,
      priceMax,
      location,
      page = 1,
      limit = 20
    } = filters

    const where: Prisma.ListingWhereInput = {
      status: 'ACTIVE'
    }

    if (industry) {
      where.industry = industry
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.askingPrice = {}
      if (priceMin !== undefined) where.askingPrice.gte = priceMin
      if (priceMax !== undefined) where.askingPrice.lte = priceMax
    }

    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } }
      ]
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          seller: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              savedBy: true,
              inquiries: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.listing.count({ where })
    ])

    return {
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    }
  }

  static async getListingById(id: string, userId?: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
            createdAt: true
          }
        },
        financials: true,
        documents: userId ? true : false,
        _count: {
          select: {
            savedBy: true,
            inquiries: true
          }
        }
      }
    })

    if (!listing) {
      throw new Error('Listing not found')
    }

    // Check if user can view sensitive data
    const canViewSensitiveData = userId === listing.sellerId

    if (!canViewSensitiveData) {
      delete (listing as any).financials
      delete (listing as any).documents
    }

    return listing
  }

  static async createListing(data: Prisma.ListingCreateInput) {
    return prisma.listing.create({
      data,
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })
  }

  static async updateListing(
    id: string,
    data: Prisma.ListingUpdateInput,
    userId: string
  ) {
    // Verify ownership
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { sellerId: true }
    })

    if (!listing || listing.sellerId !== userId) {
      throw new Error('Unauthorized')
    }

    return prisma.listing.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  }
}
```

This Next.js Full-Stack Architect skill provides comprehensive patterns for building scalable, performant, and maintainable Next.js applications with modern best practices.