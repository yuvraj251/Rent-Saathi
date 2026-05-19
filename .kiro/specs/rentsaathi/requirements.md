# RentSaathi — Requirements

## Product Overview

RentSaathi is a trust-first rental property marketplace designed for Tier-2/Tier-3 Indian cities. The MVP launches in **Alwar, Rajasthan** with an English-only UI and a WhatsApp-first contact model.

---

## User Roles

| Role | Description |
|------|-------------|
| **Tenant** | Browses and contacts owners/brokers for rental properties |
| **Owner** | Lists their own property for rent |
| **Broker** | Lists properties on behalf of owners |
| **Admin** | Approves/rejects listings before they go live |

---

## Functional Requirements

### FR-1: Authentication
- Users can sign up and log in via Supabase Auth (email/password and Google OAuth)
- Role is assigned at signup: Tenant, Owner, or Broker
- Admin role is seeded manually in the database

### FR-2: Property Listing (Add Property)
- Owners and Brokers can submit a new property listing
- Required fields: title, description, rent (₹/month), deposit, property type (1BHK/2BHK/3BHK/Shop/PG), furnishing status, area/locality, city (Alwar), photos (up to 5), contact WhatsApp number
- Optional fields: floor number, parking availability, water/electricity details
- Listings are submitted in "pending" state and require admin approval

### FR-3: Admin Approval Panel
- Admin can view all pending listings
- Admin can approve or reject a listing with an optional rejection reason
- Only approved listings appear on public pages

### FR-4: Property Browse & Search
- Tenants (and unauthenticated users) can browse all approved listings
- Filter by: property type, rent range, locality, furnishing status
- Sort by: newest first, rent low-to-high, rent high-to-low

### FR-5: Property Detail Page
- Shows full property information, photos (gallery), and trust badge (verified/unverified)
- Primary CTA: "Contact on WhatsApp" — opens WhatsApp with pre-filled message to the lister's number
- Secondary info: listed by Owner or Broker, listing date

### FR-6: Trust System
- Listings are marked as **Verified** or **Unverified**
- Admin sets verification status during approval
- Verified badge is displayed prominently on listing cards and detail page

### FR-7: Owner/Broker Dashboard
- Shows all listings submitted by the logged-in user
- Status indicators: Pending, Approved, Rejected
- Ability to edit or delete own listings

### FR-8: Homepage
- Hero section with city tagline and search CTA
- Featured/latest approved listings grid
- Trust messaging (verified listings, local focus)
- Quick filters for property types

---

## Non-Functional Requirements

| NFR | Requirement |
|-----|-------------|
| **Performance** | Pages load under 3s on 4G connections |
| **Responsiveness** | Fully responsive — mobile-first design |
| **SEO** | Server-side rendered pages for property listings |
| **Security** | Row-level security on Supabase; auth-gated routes for dashboard/admin |
| **Accessibility** | Semantic HTML, proper contrast ratios, keyboard navigable |
| **Scalability** | Architecture supports adding more cities later |

---

## MVP Scope Boundaries

### In Scope (MVP)
- Single city: Alwar, Rajasthan
- English-only UI
- WhatsApp-based contact (no in-app messaging)
- Manual admin approval workflow
- Verified/Unverified trust badges
- Photo uploads via Supabase Storage
- Basic filters and sorting

### Out of Scope (Post-MVP)
- Payments / subscriptions
- AI-based duplicate detection
- Mobile app (React Native / Flutter)
- Advanced analytics dashboard
- In-app chat system
- Rent agreement generation
- Multi-language support
- Multi-city expansion (architecture supports it, not launched)

---

## MVP Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage with hero, featured listings, filters |
| `/properties` | Public | Browse all approved listings with filters |
| `/properties/[id]` | Public | Property detail with photos, info, WhatsApp CTA |
| `/add-property` | Auth (Owner/Broker) | Multi-step form to submit a listing |
| `/dashboard` | Auth (Owner/Broker) | View and manage own listings |
| `/admin` | Auth (Admin) | Approve/reject pending listings |
| `/login` | Public | Login/signup page |
