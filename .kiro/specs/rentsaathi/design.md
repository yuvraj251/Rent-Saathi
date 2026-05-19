# RentSaathi — Design Document

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Shadcn UI |
| Authentication | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage |
| Deployment | Vercel |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Next.js App                      │
│                (App Router)                       │
├─────────────┬───────────────┬───────────────────┤
│  Pages      │  Components   │  Server Actions    │
│  (SSR/SSG)  │  (Client)     │  (Mutations)       │
├─────────────┴───────────────┴───────────────────┤
│              Supabase Client SDK                  │
├──────────────────────────────────────────────────┤
│    Supabase Auth  │  Supabase DB  │  Storage     │
└──────────────────────────────────────────────────┘
```

- **Server Components** for public pages (Homepage, Property Listings, Property Detail) — SEO-friendly SSR
- **Client Components** for interactive elements (forms, filters, dashboard)
- **Server Actions** for data mutations (submit listing, approve/reject)
- **Supabase Client** for auth state management and real-time subscriptions (if needed later)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Homepage (/)
│   ├── login/
│   │   └── page.tsx               # Login/Signup (/login)
│   ├── properties/
│   │   ├── page.tsx               # Property listing (/properties)
│   │   └── [id]/
│   │       └── page.tsx           # Property detail (/properties/[id])
│   ├── add-property/
│   │   └── page.tsx               # Add property form (/add-property)
│   ├── dashboard/
│   │   └── page.tsx               # Owner/Broker dashboard (/dashboard)
│   └── admin/
│       └── page.tsx               # Admin approval panel (/admin)
├── components/
│   ├── ui/                        # Shadcn UI components
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── mobile-nav.tsx
│   ├── property/
│   │   ├── property-card.tsx
│   │   ├── property-grid.tsx
│   │   ├── property-filters.tsx
│   │   ├── property-gallery.tsx
│   │   └── whatsapp-cta.tsx
│   ├── forms/
│   │   └── add-property-form.tsx
│   └── dashboard/
│       ├── listing-table.tsx
│       └── admin-listing-card.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   ├── server.ts              # Server Supabase client
│   │   └── middleware.ts          # Auth middleware
│   ├── types/
│   │   └── database.ts            # Supabase generated types
│   ├── constants.ts               # App constants (cities, property types)
│   └── utils.ts                   # Utility functions
├── hooks/
│   ├── use-auth.ts
│   └── use-properties.ts
└── middleware.ts                   # Next.js middleware for route protection
```

---

## Database Schema

### Table: `profiles`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | References auth.users.id |
| full_name | text | NOT NULL |
| role | enum | 'tenant', 'owner', 'broker', 'admin' |
| phone | text | WhatsApp number |
| created_at | timestamptz | Default now() |

### Table: `properties`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (PK) | Default gen_random_uuid() |
| owner_id | uuid (FK) | References profiles.id |
| title | text | NOT NULL |
| description | text | NOT NULL |
| rent | integer | Monthly rent in ₹ |
| deposit | integer | Security deposit in ₹ |
| property_type | enum | '1bhk', '2bhk', '3bhk', 'shop', 'pg' |
| furnishing | enum | 'furnished', 'semi-furnished', 'unfurnished' |
| locality | text | Area/locality name |
| city | text | Default 'Alwar' |
| floor | integer | Nullable |
| parking | boolean | Default false |
| photos | text[] | Array of Supabase Storage URLs (max 5) |
| whatsapp_number | text | Contact number for enquiries |
| listed_by | enum | 'owner', 'broker' |
| status | enum | 'pending', 'approved', 'rejected' |
| is_verified | boolean | Default false (set by admin) |
| rejection_reason | text | Nullable |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

### Enums

```sql
CREATE TYPE user_role AS ENUM ('tenant', 'owner', 'broker', 'admin');
CREATE TYPE property_type AS ENUM ('1bhk', '2bhk', '3bhk', 'shop', 'pg');
CREATE TYPE furnishing_status AS ENUM ('furnished', 'semi-furnished', 'unfurnished');
CREATE TYPE listing_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE lister_type AS ENUM ('owner', 'broker');
```

### Row-Level Security (RLS) Policies

| Table | Policy | Rule |
|-------|--------|------|
| profiles | Users can read own profile | `auth.uid() = id` |
| profiles | Users can update own profile | `auth.uid() = id` |
| properties | Anyone can read approved listings | `status = 'approved'` |
| properties | Owners can read own listings (any status) | `auth.uid() = owner_id` |
| properties | Owners/Brokers can insert listings | `role IN ('owner', 'broker')` |
| properties | Owners can update own listings | `auth.uid() = owner_id` |
| properties | Admins can update any listing | `role = 'admin'` |
| properties | Owners can delete own listings | `auth.uid() = owner_id` |

---

## Authentication Flow

1. User visits `/login`
2. Signs up with email/password or Google OAuth
3. On signup, selects role (Tenant / Owner / Broker)
4. A `profiles` row is created via a Supabase trigger on `auth.users` insert
5. Middleware checks auth state and redirects:
   - Unauthenticated users trying to access `/dashboard`, `/add-property`, `/admin` → redirect to `/login`
   - Non-admin users trying to access `/admin` → redirect to `/`
   - Non-owner/broker users trying to access `/add-property` or `/dashboard` → redirect to `/`

---

## Key UI Patterns

### WhatsApp CTA
```
Button: "Contact on WhatsApp"
URL: https://wa.me/91{whatsapp_number}?text=Hi, I'm interested in your property "{title}" listed on RentSaathi.
```

### Trust Badge
- **Verified**: Green shield icon + "Verified" label
- **Unverified**: Gray info icon + "Unverified" label
- Displayed on property cards and detail page

### Property Card
- Thumbnail photo
- Title, locality, rent/month
- Property type badge (1BHK, 2BHK, etc.)
- Furnishing status
- Trust badge (verified/unverified)
- "Listed by Owner/Broker" tag

### Responsive Breakpoints
- Mobile: < 640px (single column)
- Tablet: 640px–1024px (2 columns)
- Desktop: > 1024px (3 columns grid)

---

## Image Upload Strategy

- Max 5 photos per listing
- Stored in Supabase Storage bucket: `property-photos`
- Path: `{user_id}/{property_id}/{filename}`
- Accepted formats: JPEG, PNG, WebP
- Max file size: 5MB per image
- Thumbnails generated client-side before upload (for card previews)

---

## Routing & Middleware

| Route | Auth Required | Role Required |
|-------|:------------:|:-------------:|
| `/` | No | — |
| `/properties` | No | — |
| `/properties/[id]` | No | — |
| `/login` | No | — |
| `/add-property` | Yes | Owner, Broker |
| `/dashboard` | Yes | Owner, Broker |
| `/admin` | Yes | Admin |

---

## State Management

- **Server state**: Fetched via Server Components and Server Actions (no client-side data fetching library for MVP)
- **Auth state**: Managed via Supabase Auth helpers for Next.js
- **Form state**: React Hook Form + Zod validation for the add-property form
- **URL state**: Filters and sorting managed via URL search params (shareable URLs)

---

## Error Handling

- Form validation errors shown inline (Zod + React Hook Form)
- API/Server Action errors shown via toast notifications (Shadcn Toast)
- 404 page for non-existent properties
- Unauthorized access handled by middleware redirects
- Image upload failures shown with retry option
