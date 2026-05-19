# RentSaathi — Technical Design Document

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | SSR, routing, server actions |
| Language | TypeScript | Type safety across the stack |
| Styling | Tailwind CSS | Utility-first responsive styling |
| UI Library | Shadcn UI | Accessible, composable components |
| Auth | Supabase Auth | Email/password + Google OAuth |
| Database | Supabase (PostgreSQL) | Relational data with RLS |
| Storage | Supabase Storage | Property photo uploads |
| Deployment | Vercel | Edge-optimized hosting |

---

## 1. Folder Structure

```
rent-saathi/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (fonts, metadata, providers)
│   │   ├── page.tsx                    # Homepage (/)
│   │   ├── login/
│   │   │   └── page.tsx               # Auth page (/login)
│   │   ├── properties/
│   │   │   ├── page.tsx               # Listing page (/properties)
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Detail page (/properties/[id])
│   │   ├── add-property/
│   │   │   └── page.tsx               # Add property (/add-property)
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Owner dashboard (/dashboard)
│   │   ├── admin/
│   │   │   └── page.tsx               # Admin panel (/admin)
│   │   └── not-found.tsx              # 404 page
│   ├── components/
│   │   ├── ui/                        # Shadcn UI primitives (button, card, input, etc.)
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── mobile-nav.tsx
│   │   ├── property/
│   │   │   ├── property-card.tsx
│   │   │   ├── property-filters.tsx
│   │   │   ├── property-grid.tsx
│   │   │   ├── property-gallery.tsx
│   │   │   ├── trust-badges.tsx
│   │   │   ├── whatsapp-button.tsx
│   │   │   └── call-button.tsx
│   │   ├── forms/
│   │   │   └── add-property-form.tsx
│   │   ├── admin/
│   │   │   └── admin-listing-card.tsx
│   │   └── shared/
│   │       ├── empty-state.tsx
│   │       └── loading-state.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser client (createBrowserClient)
│   │   │   ├── server.ts              # Server client (createServerClient)
│   │   │   └── admin.ts              # Service role client (admin operations)
│   │   ├── types/
│   │   │   └── database.ts            # Generated Supabase types
│   │   ├── validations/
│   │   │   └── property.ts            # Zod schemas for forms
│   │   ├── constants.ts               # Localities, property types, amenities
│   │   └── utils.ts                   # formatRent, buildWhatsAppURL, etc.
│   ├── hooks/
│   │   ├── use-auth.ts                # Auth state hook
│   │   └── use-debounce.ts            # Debounced search input
│   ├── actions/
│   │   ├── property.ts                # Server actions: create, update, delete property
│   │   ├── admin.ts                   # Server actions: approve, reject, remove
│   │   └── auth.ts                    # Server actions: signup, login, logout
│   └── middleware.ts                   # Route protection middleware
├── public/
│   ├── placeholder-property.svg       # Default property image
│   └── icons/                         # Trust badge icons, etc.
├── supabase/
│   └── migrations/                    # SQL migration files
├── .env.local.example
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 2. Route Structure

| Route | Type | Auth | Role | Rendering |
|-------|------|:----:|------|-----------|
| `/` | Public | No | — | SSR (Server Component) |
| `/properties` | Public | No | — | SSR with URL search params |
| `/properties/[id]` | Public | No | — | SSR (dynamic) |
| `/add-property` | Protected | Yes | Owner, Broker | Client Component (form) |
| `/dashboard` | Protected | Yes | Owner, Broker | SSR + Client interactivity |
| `/admin` | Protected | Yes | Admin | SSR + Client interactivity |
| `/login` | Public | No | — | Client Component (auth forms) |

### Route Protection Logic

```
middleware.ts runs on every request:
├── Check if route is protected (/add-property, /dashboard, /admin)
├── If protected:
│   ├── No session → redirect to /login?returnUrl={current_path}
│   ├── Has session but wrong role → redirect to / with error toast
│   └── Valid session + correct role → allow through
└── If public → allow through
```

---

## 3. Component Architecture

### Layout Components

**Navbar**
- Logo (left) → links to /
- Navigation links: Properties, Add Property (auth-gated)
- Auth section (right): Login button OR User dropdown (name, dashboard, logout)
- Mobile: collapses to hamburger → Sheet (slide-in nav)

**Footer**
- Logo + tagline
- Quick links: Properties, Add Property, Login
- "Made for Alwar" trust text
- Minimal — no overloaded footer

### Property Components

**PropertyCard**
- Props: property data object
- Renders: image, title, locality, rent, type badge, owner/broker tag, verified badge, WhatsApp button, Call button
- Clickable → navigates to /properties/[id]
- Used in: Homepage featured, Properties grid, Dashboard

**PropertyFilters**
- Manages filter state via URL search params (useSearchParams)
- Renders: Search input, Locality dropdown, Budget range, Property type chips
- On change: updates URL params → triggers server re-fetch

**PropertyGallery**
- Props: photos array
- Desktop: Large image + thumbnail strip below
- Mobile: Horizontal swipeable carousel
- Handles: 0 photos (placeholder), 1 photo (no thumbnails), 2-5 photos (full gallery)

**TrustBadges**
- Static component — no props needed
- Renders 4 trust signals as icon+text cards
- Used on: Homepage, Property detail page

**WhatsAppButton**
- Props: phoneNumber, propertyTitle
- Renders: Green button with WhatsApp icon
- onClick: opens wa.me link with pre-filled message
- Sizes: small (on card), large (on detail page)

**CallButton**
- Props: phoneNumber
- Renders: Blue button with phone icon
- onClick: opens tel: link
- Sizes: small (on card), large (on detail page)

**AddPropertyForm**
- Multi-section single-page form
- Uses React Hook Form + Zod validation
- Sections: Basic Info → Details → Photos → Contact → Submit
- Manages image upload state internally
- On submit: calls server action

**AdminListingCard**
- Props: property data + admin actions
- Renders: Expanded property preview (photos, all info, owner details)
- Actions: Approve (with verify toggle), Reject (with reason dialog), Remove

### Shared Components

**EmptyState**
- Props: icon, title, description, actionLabel, actionHref
- Reusable empty state for any list/grid view

**LoadingState**
- Skeleton variants: card, table-row, detail-page, gallery
- Matches the exact layout of loaded content

---

## 4. State Management Approach

### Principle: Minimal Client State

RentSaathi uses a **server-first** state strategy — most data lives on the server and is fetched via Server Components or Server Actions.

| State Type | Solution |
|-----------|----------|
| Server data (properties, profiles) | Server Components fetch directly from Supabase |
| URL state (filters, sort, search, pagination) | URL search params via `useSearchParams` |
| Auth state | Supabase Auth helpers + middleware |
| Form state | React Hook Form (local to form component) |
| Mutation state | Server Actions with `useFormStatus` / `useTransition` |
| Toast/notifications | Shadcn Toast (ephemeral client state) |
| Image upload state | Local component state (useState) |

### No Global State Library

No Redux, Zustand, or Context needed for MVP. The App Router's Server Components + URL params handle 90% of state.

### Data Flow Pattern

```
Server Component (page.tsx)
├── Fetches data from Supabase (server-side)
├── Passes data as props to child components
├── Child components are either:
│   ├── Server Components (static display)
│   └── Client Components ("use client" — interactive elements)
│       ├── Forms use React Hook Form
│       ├── Filters update URL search params
│       └── Actions call Server Actions
```

---

## 5. Supabase Integration

### Client Configuration

Three Supabase client types:

| Client | File | Used In | Purpose |
|--------|------|---------|---------|
| Browser Client | `lib/supabase/client.ts` | Client Components | Auth state, real-time (future) |
| Server Client | `lib/supabase/server.ts` | Server Components, Route Handlers | Data fetching with cookies |
| Admin Client | `lib/supabase/admin.ts` | Server Actions (admin) | Bypass RLS for admin operations |

### Database Tables

**profiles**
- Created automatically via Supabase trigger on auth.users insert
- Stores: full_name, role, phone
- RLS: users can read/update own profile; admin can read all

**properties**
- Main listing table with all property data
- RLS policies:
  - Public read: only where `status = 'approved'`
  - Owner read: own listings (any status)
  - Owner insert: if role is 'owner' or 'broker'
  - Owner update: own listings only
  - Owner delete: own listings only
  - Admin update: any listing (for approve/reject)
  - Admin delete: any listing (for remove)

**reports**
- Stores user reports of fake listings
- RLS: public insert (anyone can report), admin read

### Row-Level Security Strategy

```
Public pages → Server client respects RLS → only approved listings returned
Dashboard → Server client with user session → only user's own listings
Admin panel → Admin client (service role) → bypasses RLS for moderation
```

---

## 6. Authentication Flow

### Sign Up

```
User visits /login → selects "Sign Up" tab
├── Fills: name, email, password, phone, role (Tenant/Owner/Broker)
├── Supabase Auth creates user in auth.users
├── Database trigger fires → creates row in profiles table
├── Session cookie set automatically
├── Redirect to returnUrl or /
```

### Login

```
User visits /login → selects "Login" tab
├── Enters email + password
├── Supabase Auth validates credentials
├── Session cookie set
├── Redirect to returnUrl or /
```

### Google OAuth

```
User clicks "Continue with Google"
├── Redirected to Google consent screen
├── Returns to /login with code
├── Supabase exchanges code for session
├── If new user → show role selection modal
│   └── On role select → update profiles table
├── Session cookie set
├── Redirect to returnUrl or /
```

### Session Management

- Sessions stored in HTTP-only cookies (via @supabase/ssr)
- Middleware reads cookies on every request to check auth state
- Token refresh handled automatically by Supabase
- Logout: clears session, redirects to /

### Protected Route Pattern

```
middleware.ts:
1. Read session from cookies
2. If no session + protected route → redirect /login?returnUrl=...
3. If session exists → check user role from profiles table
4. If role doesn't match route requirement → redirect /
5. If all checks pass → allow request through
```

---

## 7. Property Upload Flow

### Architecture

```
Client (AddPropertyForm)
├── User fills form fields (React Hook Form + Zod)
├── User uploads photos (client-side preview + validation)
├── User clicks "Submit for Review"
├── Client calls Server Action: createProperty()
│
Server Action: createProperty()
├── Validate form data (Zod schema)
├── Upload images to Supabase Storage
│   ├── Path: property-photos/{user_id}/{uuid}/{filename}
│   ├── Returns public URLs for each image
│   └── On failure: abort, return error
├── Insert row into properties table
│   ├── status: 'pending'
│   ├── photos: [array of public URLs]
│   └── owner_id: current user ID
├── On success: return { success: true, propertyId }
├── On failure: cleanup uploaded images, return error
│
Client receives response
├── Success → redirect to confirmation screen
└── Failure → show error toast, preserve form data
```

### Validation Layers

1. **Client-side** (React Hook Form + Zod): Immediate feedback as user types
2. **Server-side** (Server Action + Zod): Re-validate before DB insert (never trust client)
3. **Database** (constraints + RLS): Final safety net

---

## 8. Admin Moderation Flow

### Architecture

```
Admin visits /admin
├── Server Component fetches all pending listings (via admin client)
├── Renders AdminListingCard for each
│
Admin clicks "Approve":
├── Optionally toggles "Mark as Verified" checkbox
├── Calls Server Action: approveListing(id, isVerified)
│   ├── Updates: status = 'approved', is_verified = true/false, updated_at = now()
│   └── Uses admin client (bypasses RLS)
├── Optimistic UI: card moves to approved section
├── revalidatePath('/admin') + revalidatePath('/properties')
│
Admin clicks "Reject":
├── Modal opens → enters rejection reason
├── Calls Server Action: rejectListing(id, reason)
│   ├── Updates: status = 'rejected', rejection_reason = reason
│   └── Uses admin client
├── Card moves to rejected section
│
Admin clicks "Remove":
├── Confirmation dialog
├── Calls Server Action: removeListing(id)
│   ├── Deletes all photos from Supabase Storage
│   ├── Deletes property row from database
│   └── Deletes associated reports
├── Card removed from UI
```

### Revalidation Strategy

After any admin action:
- `revalidatePath('/admin')` — refresh admin panel data
- `revalidatePath('/properties')` — refresh public listing page
- `revalidatePath('/')` — refresh homepage featured listings

---

## 9. Image Upload Architecture

### Client-Side Flow

```
User selects files (or drags into drop zone)
├── Client validates:
│   ├── File count ≤ 5
│   ├── Each file ≤ 5MB
│   ├── Format: JPEG, PNG, or WebP
│   └── On failure: show inline error, reject file
├── Generate preview thumbnails (URL.createObjectURL)
├── Store in local state: { file, preview, status: 'pending' }
├── Display preview grid with remove buttons
├── First image auto-marked as "Cover Photo"
```

### Server-Side Upload (inside Server Action)

```
For each image file:
├── Generate unique filename: {uuid}-{original_name}
├── Upload path: property-photos/{user_id}/{property_id}/{filename}
├── Call supabase.storage.from('property-photos').upload(path, file)
├── On success: get public URL
├── On failure: retry once, then mark as failed
│
After all uploads:
├── Collect all successful public URLs into array
├── Store in properties.photos column
├── If any upload failed: return partial success or abort entire submission
```

### Storage Bucket Configuration

```
Bucket: property-photos
├── Public: true (anyone can read via public URL)
├── File size limit: 5MB
├── Allowed MIME types: image/jpeg, image/png, image/webp
├── RLS policies:
│   ├── Authenticated users can upload to their own path ({user_id}/*)
│   ├── Users can delete files in their own path
│   └── Admin can delete any file
```

### Cleanup Strategy

- On property delete → delete all files in `property-photos/{user_id}/{property_id}/`
- On edit (photo removed) → delete specific file from storage
- Orphaned files (failed submissions) → manual cleanup (post-MVP cron job)

---

## 10. Responsive Design Approach

### Breakpoints

| Breakpoint | Width | Target |
|-----------|-------|--------|
| Default | 0–639px | Mobile phones (portrait) |
| sm | 640px+ | Large phones (landscape) |
| md | 768px+ | Tablets |
| lg | 1024px+ | Small laptops |
| xl | 1280px+ | Desktops |

### Mobile-First Strategy

All base styles are mobile. Larger screens add complexity:

```
Base (mobile): single column, stacked layout, full-width elements
sm: minor adjustments (larger text, more padding)
md: 2-column grids, side-by-side layouts
lg: 3-column grids, sidebar layouts
xl: max-width container, comfortable spacing
```

### Responsive Patterns by Component

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Navbar | Hamburger → Sheet | Full nav | Full nav |
| Property Grid | 1 column | 2 columns | 3 columns |
| Property Detail | Stacked (gallery → info → contact) | Stacked | 2-col (content + sidebar) |
| Filters | Collapsible sheet (bottom) | Horizontal bar | Horizontal bar |
| Contact Buttons | Sticky bottom bar | Sticky bottom bar | Inline in sidebar |
| Dashboard Table | Card view (stacked) | Table view | Table view |
| Admin Cards | Full-width stacked | 2 columns | 2 columns |

### Design Tokens (Tailwind Config)

```
Colors:
├── Primary: Green (#16a34a / green-600) — CTAs, verified badges, WhatsApp
├── Secondary: Blue (#2563eb / blue-600) — Call button, links
├── Background: Warm white (#fafaf9 / stone-50)
├── Card background: White (#ffffff)
├── Text primary: Near-black (#1c1917 / stone-900)
├── Text secondary: Gray (#78716c / stone-500)
├── Border: Light gray (#e7e5e4 / stone-200)
├── Warning: Yellow/Amber (#f59e0b) — Pending badges
├── Error: Red (#dc2626) — Rejected, errors

Typography:
├── Font: Inter (clean, readable on all sizes)
├── Headings: Bold, tracking-tight
├── Body: Regular, leading-relaxed

Spacing:
├── Section padding: py-12 (mobile), py-16 (desktop)
├── Card padding: p-4
├── Grid gap: gap-4 (mobile), gap-6 (desktop)
├── Max content width: max-w-7xl (1280px)

Border Radius:
├── Cards: rounded-xl (12px)
├── Buttons: rounded-lg (8px)
├── Badges: rounded-full
├── Images: rounded-lg

Shadows:
├── Cards: shadow-sm on hover → shadow-md
├── Sticky bar: shadow-lg (upward)
```

### Touch Targets

- All interactive elements: min 44x44px on mobile
- Buttons: h-12 (48px) on mobile, h-10 (40px) on desktop
- Card tap areas: entire card surface is clickable
- Filter chips: px-4 py-2 with comfortable spacing

### Performance Considerations

- Images: Next.js `<Image>` with lazy loading + blur placeholder
- Fonts: `next/font` with font-display: swap
- Above-the-fold: No layout shift (fixed heights for hero, image placeholders)
- Mobile data: Compressed images, skeleton loaders, minimal JS bundle

---

## Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| Server Components by default | SEO, performance, smaller JS bundle |
| URL params for filters | Shareable URLs, back/forward works, no client state |
| Server Actions for mutations | Type-safe, no API routes needed, automatic revalidation |
| Supabase RLS over custom auth checks | Security at database level, can't be bypassed |
| Shadcn UI over full component library | Customizable, tree-shakeable, owns the code |
| Single-page form (not multi-step) | Simpler for MVP, less friction for non-technical owners |
| Sticky contact buttons on mobile | Primary CTA always visible, matches WhatsApp-first UX |
| No global state library | Unnecessary complexity for SSR-first app |
| Green primary color | Matches WhatsApp brand familiarity for target audience |
| Warm white background | Avoids clinical feel, matches local/trustworthy brand |
