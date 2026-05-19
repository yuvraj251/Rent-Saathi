# RentSaathi — Implementation Tasks

## Phase 1: Foundation Setup

- [ ] 1.1 Initialize Next.js 14 project with TypeScript and App Router
- [ ] 1.2 Configure Tailwind CSS with custom theme (colors, fonts, spacing)
- [ ] 1.3 Install and configure Shadcn UI (button, card, input, select, toast, dialog, badge, dropdown-menu, sheet, separator, avatar, table)
- [ ] 1.4 Set up Supabase project and obtain API keys
- [ ] 1.5 Create Supabase client utilities (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- [ ] 1.6 Create database schema — run SQL migrations for tables (`profiles`, `properties`) and enums
- [ ] 1.7 Configure Row-Level Security (RLS) policies on all tables
- [ ] 1.8 Set up Supabase Storage bucket `property-photos` with access policies
- [ ] 1.9 Create TypeScript types (`lib/types/database.ts`) matching the schema
- [ ] 1.10 Create constants file (`lib/constants.ts`) — property types, furnishing options, cities, filter options
- [ ] 1.11 Create utility functions (`lib/utils.ts`) — formatRent, buildWhatsAppURL, slugify
- [ ] 1.12 Set up Next.js middleware for auth-based route protection (`middleware.ts`)
- [ ] 1.13 Create root layout (`app/layout.tsx`) with font, metadata, and providers
- [ ] 1.14 Set up environment variables (`.env.local.example`) for Supabase URL and keys

---

## Phase 2: Homepage

- [ ] 2.1 Create shared layout components — Header (logo, nav, auth buttons), Footer, MobileNav (sheet)
- [ ] 2.2 Build Hero section — city tagline, search/browse CTA button, background image/illustration
- [ ] 2.3 Build QuickFilters section — clickable property type cards (1BHK, 2BHK, 3BHK, Shop, PG)
- [ ] 2.4 Build FeaturedListings section — grid of latest 6 approved PropertyCards (server-fetched)
- [ ] 2.5 Build TrustBanner section — trust messaging (verified listings, local Alwar focus, WhatsApp contact)
- [ ] 2.6 Build PropertyCard component — thumbnail, title, rent, locality, type badge, trust badge, listed-by tag
- [ ] 2.7 Assemble Homepage (`app/page.tsx`) with all sections
- [ ] 2.8 Ensure mobile responsiveness for all homepage sections

---

## Phase 3: Property Listing Page

- [ ] 3.1 Build PropertyFilters component — property type, rent range, locality, furnishing (URL search params)
- [ ] 3.2 Build SortDropdown component — newest, rent low-to-high, rent high-to-low
- [ ] 3.3 Build PropertyGrid component — responsive grid layout for PropertyCards
- [ ] 3.4 Create server-side data fetching for properties with filters and sorting
- [ ] 3.5 Assemble Properties page (`app/properties/page.tsx`) — filters + sort + grid
- [ ] 3.6 Add empty state UI (no results found)
- [ ] 3.7 Add loading skeleton states for property grid

---

## Phase 4: Property Detail Page

- [ ] 4.1 Build PropertyGallery component — image carousel/gallery with thumbnails
- [ ] 4.2 Build PropertyInfo component — title, rent, deposit, type, furnishing, floor, parking, locality, description
- [ ] 4.3 Build WhatsAppCTA component — "Contact on WhatsApp" button with pre-filled message
- [ ] 4.4 Build TrustBadge component — verified (green shield) / unverified (gray info) display
- [ ] 4.5 Build ListedByTag component — shows "Listed by Owner" or "Listed by Broker" + date
- [ ] 4.6 Create server-side data fetching for single property by ID
- [ ] 4.7 Assemble Property Detail page (`app/properties/[id]/page.tsx`)
- [ ] 4.8 Add 404 handling for non-existent properties
- [ ] 4.9 Add SEO metadata (dynamic title, description, OG image)

---

## Phase 5: Add Property Flow

- [ ] 5.1 Build Login/Signup page (`app/login/page.tsx`) — email/password + Google OAuth + role selection
- [ ] 5.2 Create Supabase Auth trigger to insert `profiles` row on user signup
- [ ] 5.3 Create `useAuth` hook — current user, role, loading state, sign out
- [ ] 5.4 Build AddPropertyForm component — multi-step or single-page form with sections
- [ ] 5.5 Add form validation with Zod schema (title, description, rent, deposit, type, furnishing, locality, photos, WhatsApp number)
- [ ] 5.6 Build ImageUploader component — drag-and-drop / click to upload, preview, remove (max 5)
- [ ] 5.7 Create server action for property submission (insert to DB + upload photos to Storage)
- [ ] 5.8 Assemble Add Property page (`app/add-property/page.tsx`) — auth-gated, form + success state
- [ ] 5.9 Add success confirmation with "View Dashboard" CTA after submission

---

## Phase 6: Owner Dashboard

- [ ] 6.1 Create server-side data fetching for user's own listings (all statuses)
- [ ] 6.2 Build ListingTable component — tabular view with status badges (Pending/Approved/Rejected)
- [ ] 6.3 Build StatusBadge component — color-coded (yellow=pending, green=approved, red=rejected)
- [ ] 6.4 Add edit functionality — navigate to pre-filled form for editing
- [ ] 6.5 Add delete functionality — confirmation dialog + server action to delete listing
- [ ] 6.6 Assemble Dashboard page (`app/dashboard/page.tsx`) — auth-gated, listings table + stats summary
- [ ] 6.7 Add empty state for users with no listings

---

## Phase 7: Admin Approval Panel

- [ ] 7.1 Create server-side data fetching for all pending listings
- [ ] 7.2 Build AdminListingCard component — property preview + approve/reject actions
- [ ] 7.3 Build ApproveDialog — confirm approval + toggle verified status
- [ ] 7.4 Build RejectDialog — rejection reason textarea + confirm
- [ ] 7.5 Create server actions for approve and reject (update status, is_verified, rejection_reason)
- [ ] 7.6 Assemble Admin page (`app/admin/page.tsx`) — admin-gated, pending listings list
- [ ] 7.7 Add tabs/filters for viewing Pending / Approved / Rejected listings
- [ ] 7.8 Add empty state for no pending listings

---

## Phase 8: Testing & Deployment

- [ ] 8.1 Manual QA — test all user flows (signup, login, add property, browse, filter, detail, WhatsApp CTA, dashboard, admin)
- [ ] 8.2 Test responsive design on mobile (375px), tablet (768px), and desktop (1440px)
- [ ] 8.3 Test auth flows — protected routes redirect correctly, role-based access works
- [ ] 8.4 Test edge cases — no photos, max photos, long text, special characters
- [ ] 8.5 Performance audit — Lighthouse score > 80 on all pages
- [ ] 8.6 Set up Vercel project and connect GitHub repository
- [ ] 8.7 Configure environment variables on Vercel (Supabase URL, Anon Key, Service Role Key)
- [ ] 8.8 Deploy to production and verify all routes work
- [ ] 8.9 Set up custom domain (if available)
- [ ] 8.10 Final smoke test on production URL

---

## Task Dependencies

```
Phase 1 (Foundation) → All other phases depend on this
Phase 2 (Homepage) → Requires Phase 1 complete (shared components reused everywhere)
Phase 3 (Listing Page) → Requires Phase 2 (PropertyCard component)
Phase 4 (Detail Page) → Requires Phase 3 (data fetching patterns)
Phase 5 (Add Property) → Requires Phase 1 (auth setup, DB schema)
Phase 6 (Dashboard) → Requires Phase 5 (listings must exist)
Phase 7 (Admin Panel) → Requires Phase 5 (pending listings to approve)
Phase 8 (Testing) → Requires all phases complete
```

---

## Estimated Effort

| Phase | Tasks | Complexity |
|-------|:-----:|:----------:|
| Phase 1: Foundation | 14 | Medium |
| Phase 2: Homepage | 8 | Medium |
| Phase 3: Listing Page | 7 | Medium |
| Phase 4: Detail Page | 9 | Medium |
| Phase 5: Add Property | 9 | High |
| Phase 6: Dashboard | 7 | Medium |
| Phase 7: Admin Panel | 8 | Medium |
| Phase 8: Testing | 10 | Low |
| **Total** | **72** | — |
