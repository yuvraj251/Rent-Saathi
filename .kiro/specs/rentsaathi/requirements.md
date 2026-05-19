# RentSaathi — MVP Requirements

## Overview

RentSaathi is a trust-first rental property marketplace for Tier-2/Tier-3 Indian cities, launching in Alwar, Rajasthan. This document defines the complete functional requirements for the MVP release.

---

## 1. Homepage (`/`)

### 1.1 Hero Section

**Description:**
A visually prominent banner at the top of the homepage that communicates the core value proposition and drives users to search or browse properties.

**Acceptance Criteria:**
- Displays a headline: "Find Verified Rentals in Alwar"
- Displays a subheadline explaining the WhatsApp-first, trust-based approach
- Contains a search input field with placeholder text (e.g., "Search by locality or property type")
- Contains a primary CTA button: "Browse Properties"
- Background uses a warm, locally relevant illustration or gradient (not a stock photo)
- Fully responsive — stacks vertically on mobile

**Edge Cases:**
- Search with empty input → redirects to `/properties` with no filters
- Search with whitespace-only input → treated as empty search


### 1.2 Search Bar

**Description:**
A prominent search input that allows users to quickly find properties by locality name or property type keyword.

**Acceptance Criteria:**
- Text input with magnifying glass icon
- On submit, navigates to `/properties?q={search_term}`
- Supports keyboard "Enter" to submit
- Placeholder text guides user: "Search by locality, e.g., Rajgarh Road, Malviya Nagar"
- Positioned within the hero section on desktop, below hero on mobile

**Edge Cases:**
- Special characters in search → sanitize input, no SQL injection risk (Supabase handles this)
- Very long search terms (>200 chars) → truncate to 200 characters

### 1.3 Featured Properties

**Description:**
A grid of the latest 6 approved property listings to give users an immediate sense of available rentals.

**Acceptance Criteria:**
- Displays up to 6 PropertyCards in a responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Only shows listings with `status = 'approved'`
- Ordered by `created_at` descending (newest first)
- Section heading: "Featured Rentals in Alwar"
- "View All Properties" link below the grid → navigates to `/properties`
- Server-side rendered for SEO

**Edge Cases:**
- Fewer than 6 approved listings → show whatever is available (no placeholder cards)
- Zero approved listings → show a message: "New listings coming soon! Be the first to list your property." with CTA to `/add-property`


### 1.4 Popular Localities

**Description:**
A section showcasing popular rental localities in Alwar, allowing one-tap filtering.

**Acceptance Criteria:**
- Displays 6–8 locality cards/chips (e.g., Rajgarh Road, Malviya Nagar, Scheme 10, Hope Circus, Manu Marg, Alwar Gate)
- Each locality is clickable → navigates to `/properties?locality={locality_name}`
- Section heading: "Popular Localities"
- Visual style: rounded cards/chips with locality name and optional property count
- Responsive: horizontal scroll on mobile, grid on desktop

**Edge Cases:**
- Locality with zero approved listings → still show the chip, listing page shows empty state
- Locality names with spaces → URL-encoded in query params

### 1.5 Trust Badges Section

**Description:**
A visual trust bar communicating why users should trust RentSaathi over WhatsApp groups or random listings.

**Acceptance Criteria:**
- Displays 3–4 trust signals as icon + text cards:
  - "Admin Verified Listings" (shield icon)
  - "Direct Owner Contact" (WhatsApp icon)
  - "No Fake Listings" (check icon)
  - "Local Alwar Focus" (map pin icon)
- Horizontally laid out on desktop, 2x2 grid on mobile
- No interactivity — purely informational

**Edge Cases:**
- None (static content)

### 1.6 Owner CTA Section

**Description:**
A call-to-action section encouraging property owners to list their property for free.

**Acceptance Criteria:**
- Heading: "Own a property in Alwar? List it for free!"
- Subtext: "Reach verified tenants without paying brokerage"
- CTA button: "List Your Property" → navigates to `/add-property`
- If user is not logged in and clicks CTA → redirect to `/login` with return URL to `/add-property`
- Visually distinct background (light accent color)

**Edge Cases:**
- User already logged in as tenant → still show section, clicking CTA opens role selection or message about owner/broker access
- User logged in as owner/broker → CTA goes directly to `/add-property`


### 1.7 Homepage User Flow

```
User lands on homepage
├── Sees hero section with value proposition
├── Can search → goes to /properties?q=...
├── Can click locality chip → goes to /properties?locality=...
├── Can click featured property card → goes to /properties/[id]
├── Can click "Browse Properties" → goes to /properties
├── Can click "List Your Property" → goes to /add-property (or /login if unauthenticated)
└── Scrolls through trust section and footer
```

---

## 2. Property Listing Page (`/properties`)

### 2.1 Search

**Description:**
A search bar at the top of the listing page that filters properties by text query.

**Acceptance Criteria:**
- Text input pre-filled with query from URL param `?q=` if present
- Searches against property title and locality fields
- Debounced input (300ms) updates URL params without full page reload
- Clear button (X icon) to reset search
- Works in combination with other filters

**Edge Cases:**
- No results for search query → show empty state with suggestion to broaden search
- Search combined with filters that yield zero results → show "No properties match your filters"

### 2.2 Locality Filter

**Description:**
A dropdown/multi-select filter for narrowing properties by locality/area.

**Acceptance Criteria:**
- Dropdown showing known Alwar localities (from constants)
- Supports selecting a single locality
- Selected value stored in URL param: `?locality=Rajgarh+Road`
- "All Localities" option to clear the filter
- Shows count of available properties per locality (optional for MVP)

**Edge Cases:**
- Unknown locality value in URL → ignore filter, show all
- Locality with zero results → show empty state

### 2.3 Budget Filter

**Description:**
A rent range filter allowing users to set min and max monthly rent.

**Acceptance Criteria:**
- Two inputs: "Min Rent" and "Max Rent" (₹)
- Preset quick-select options: Under ₹5,000 | ₹5,000–₹10,000 | ₹10,000–₹15,000 | ₹15,000+
- URL params: `?min_rent=5000&max_rent=10000`
- Validates that min ≤ max
- Clear button to reset

**Edge Cases:**
- Min > Max → show validation error "Min rent cannot exceed max rent"
- Non-numeric input → ignore, don't update filter
- Extremely high values (>₹1,00,000) → still apply filter, likely shows zero results


### 2.4 Property Type Filter

**Description:**
Filter to narrow results by property type category.

**Acceptance Criteria:**
- Options: 1 BHK, 2 BHK, 3 BHK, Shop, PG
- Single-select dropdown or chip-style selector
- URL param: `?type=2bhk`
- "All Types" option to clear
- Can be combined with other filters

**Edge Cases:**
- Invalid type value in URL → ignore, show all types
- Type with zero listings → show empty state

### 2.5 Property Cards Grid

**Description:**
A responsive grid displaying property listing cards matching the current filters.

**Acceptance Criteria:**
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Each card displays: image, title, locality, rent, property type, owner/broker label, verified badge, WhatsApp button, Call button
- Cards are clickable → navigates to `/properties/[id]`
- Default sort: newest first
- Sort options: Newest, Rent: Low to High, Rent: High to Low
- Pagination or infinite scroll (pagination preferred for MVP — 12 items per page)

**Edge Cases:**
- Property with no photos → show a default placeholder image
- Very long title → truncate with ellipsis (max 2 lines)
- Rent amount ₹0 → display "Contact for rent" instead of ₹0

### 2.6 Listing Page User Flow

```
User arrives at /properties (from homepage or direct)
├── Sees search bar (pre-filled if coming from homepage search)
├── Sees filter bar: Locality | Budget | Property Type
├── Sees property cards grid (12 per page, paginated)
├── Can apply/remove filters → URL updates, grid refreshes
├── Can sort by newest/rent
├── Can click property card → goes to /properties/[id]
├── Can click WhatsApp button on card → opens WhatsApp
├── Can click Call button on card → opens phone dialer
└── If no results → sees empty state with suggestions
```


---

## 3. Property Card Component

### 3.1 Card Requirements

**Description:**
A reusable card component displayed on the listing page, homepage featured section, and dashboard.

**Acceptance Criteria:**

| Element | Requirement |
|---------|-------------|
| Image | First photo from listing, 16:9 aspect ratio, lazy loaded |
| Title | Property title, max 2 lines with ellipsis overflow |
| Locality | Area/locality name with map pin icon |
| Rent | Monthly rent formatted as "₹X,XXX/mo" |
| Property Type | Badge showing 1BHK/2BHK/3BHK/Shop/PG |
| Owner/Broker Label | Small tag: "By Owner" (blue) or "By Broker" (orange) |
| Verified Badge | Green shield + "Verified" text if `is_verified = true`; hidden if unverified |
| WhatsApp Button | Green WhatsApp icon button → opens `wa.me/91{number}?text=...` |
| Call Button | Blue phone icon button → opens `tel:+91{number}` |

**Edge Cases:**
- Missing image → placeholder with property type icon
- Missing WhatsApp number → hide WhatsApp button, show only Call button
- Missing phone number → hide Call button, show only WhatsApp button
- Both numbers missing → show "Contact Unavailable" text
- Rent = 0 → show "Contact for Rent"
- Unverified listing → no badge shown (clean card without negative messaging)

---

## 4. Property Detail Page (`/properties/[id]`)

### 4.1 Photo Gallery

**Description:**
An image gallery showcasing the property photos.

**Acceptance Criteria:**
- Displays all uploaded photos (up to 5)
- Primary large image with thumbnail strip below
- Click thumbnail to switch primary image
- On mobile: horizontal swipeable carousel
- Images are lazy loaded except the first one
- Click on primary image opens fullscreen lightbox (optional for MVP)

**Edge Cases:**
- Single photo → show only the large image, no thumbnails
- Zero photos → show a default placeholder with property type icon
- Broken image URL → show placeholder with retry option

### 4.2 Property Information

**Description:**
Complete property details displayed in a structured layout.

**Acceptance Criteria:**
- Title (h1)
- Rent: "₹X,XXX/month"
- Deposit: "₹X,XXX deposit"
- Property Type badge
- Furnishing status: Furnished / Semi-Furnished / Unfurnished
- Floor number (if provided)
- Parking: Yes/No
- Locality with map pin icon
- City: Alwar, Rajasthan
- Full description (multi-paragraph supported)
- Listed date: "Listed on {date}" in human-readable format
- Listed by: "By Owner" or "By Broker"

**Edge Cases:**
- Missing optional fields (floor, parking) → don't show those rows, no "N/A"
- Very long description → show full text, no truncation on detail page
- Deposit = 0 → show "No deposit required"


### 4.3 Amenities Section

**Description:**
A visual grid of amenities/features for the property.

**Acceptance Criteria:**
- Displays available amenities as icon + label chips
- Standard amenities for MVP: Parking, Water Supply, Power Backup, Lift, Balcony, Kitchen, Attached Bathroom, WiFi Ready
- Only show amenities that are marked "available" for the property
- Grid layout: 2 columns on mobile, 3–4 on desktop
- If no amenities selected → hide entire section

**Edge Cases:**
- All amenities unchecked → section is hidden entirely (no empty grid)

### 4.4 Trust Section

**Description:**
A section highlighting the trust/verification status of the listing.

**Acceptance Criteria:**
- If verified: Green banner with shield icon — "This listing is verified by RentSaathi"
- If unverified: Neutral gray info banner — "This listing has not been verified yet"
- Shows listing approval date
- Shows "Listed by Owner" or "Listed by Broker" prominently

**Edge Cases:**
- Listing that was previously verified then owner edits it → status resets to pending, trust section not visible until re-approved

### 4.5 Contact Buttons

**Description:**
Primary CTAs for contacting the property lister.

**Acceptance Criteria:**
- Two buttons, prominently displayed:
  - **WhatsApp Button** (primary, green): Opens `https://wa.me/91{number}?text=Hi, I'm interested in your property "{title}" listed on RentSaathi.`
  - **Call Button** (secondary, blue): Opens `tel:+91{number}`
- Sticky on mobile (fixed to bottom of viewport)
- Non-sticky on desktop (in sidebar or inline)
- Buttons visible without scrolling on mobile

**Edge Cases:**
- WhatsApp number missing → hide WhatsApp button
- Phone number missing → hide Call button
- Both missing → show "Contact information unavailable" with a note to check back later

### 4.6 Report Fake Listing

**Description:**
A mechanism for users to flag potentially fake or misleading listings.

**Acceptance Criteria:**
- "Report this listing" text link below the property details
- Clicking opens a small modal/dialog with:
  - Reason dropdown: "Fake listing", "Wrong information", "Already rented", "Spam", "Other"
  - Optional text area for details
  - Submit button
- No authentication required to report (to lower friction)
- On submit: stores report in a `reports` table (property_id, reason, details, created_at)
- Shows confirmation: "Thank you! We'll review this listing."
- Admin can see reports in the admin panel (post-MVP enhancement)

**Edge Cases:**
- Duplicate reports from same IP/session → allow (no deduplication in MVP)
- Very long detail text → limit to 500 characters
- Submit without selecting reason → show validation error

### 4.7 Property Detail User Flow

```
User arrives at /properties/[id]
├── Sees photo gallery at top
├── Scrolls to property info (title, rent, deposit, type, locality)
├── Sees amenities grid
├── Sees trust section (verified/unverified status)
├── Sees contact buttons (WhatsApp + Call)
│   ├── Clicks WhatsApp → opens WhatsApp with pre-filled message
│   └── Clicks Call → opens phone dialer
├── Sees "Report this listing" link
│   └── Clicks report → modal opens → submits reason
└── On mobile: sticky contact buttons at bottom
```


---

## 5. Add Property Page (`/add-property`)

### 5.1 Property Form

**Description:**
A form for property owners and brokers to submit a new rental listing for admin review.

**Acceptance Criteria:**
- Only accessible to authenticated users with role: Owner or Broker
- Form fields:

| Field | Type | Required | Validation |
|-------|------|:--------:|------------|
| Title | Text input | Yes | 5–100 characters |
| Description | Textarea | Yes | 20–2000 characters |
| Rent (₹/month) | Number input | Yes | Min ₹500, Max ₹5,00,000 |
| Deposit (₹) | Number input | Yes | Min ₹0 (zero allowed) |
| Property Type | Select | Yes | 1BHK, 2BHK, 3BHK, Shop, PG |
| Furnishing | Select | Yes | Furnished, Semi-Furnished, Unfurnished |
| Locality | Select/Text | Yes | From predefined list or custom entry |
| Floor | Number input | No | 0–50 |
| Parking | Checkbox | No | Default: unchecked |
| Amenities | Multi-checkbox | No | Select from predefined list |
| WhatsApp Number | Phone input | Yes | Indian mobile number (10 digits) |
| Contact Number | Phone input | No | Indian mobile number (10 digits) |
| Photos | File upload | Yes (min 1) | 1–5 images, max 5MB each, JPEG/PNG/WebP |
| Listed By | Radio | Yes | Owner / Broker (auto-set from user role) |

- Form validation: inline errors shown below each field on blur and on submit
- Submit button: "Submit for Review"
- On successful submit: listing created with `status = 'pending'`

**Edge Cases:**
- User tries to submit with missing required fields → show all validation errors, scroll to first error
- Image upload fails mid-way → show error on that specific image, allow retry
- Session expires during form filling → save form state to localStorage, restore on re-login
- Duplicate listing (same title + locality) → allow submission (admin handles duplicates)
- Phone number with country code (+91) → strip prefix, store 10 digits only
- Phone number with spaces/dashes → strip formatting, validate 10 digits

### 5.2 Image Upload

**Description:**
Multi-image uploader for property photos.

**Acceptance Criteria:**
- Upload zone: drag-and-drop area + "Browse Files" button
- Supports 1 to 5 images
- Accepted formats: JPEG, PNG, WebP
- Max file size: 5MB per image
- Shows upload progress for each image
- Preview thumbnails after upload with remove (X) button
- First uploaded image is marked as "Cover Photo"
- Images stored in Supabase Storage: `property-photos/{user_id}/{property_id}/{filename}`

**Edge Cases:**
- Upload > 5 images → show error: "Maximum 5 photos allowed"
- File > 5MB → show error: "File too large. Maximum 5MB per photo."
- Invalid file format (PDF, GIF) → show error: "Only JPEG, PNG, and WebP formats accepted"
- Network failure during upload → show retry button on failed image
- All images removed after upload → show validation error on submit ("At least 1 photo required")

### 5.3 Submit for Review

**Description:**
The submission flow after form is filled.

**Acceptance Criteria:**
- On valid form submit: create property record with `status = 'pending'`
- Upload all images to Supabase Storage, store URLs in property record
- Show loading state on submit button: "Submitting..."
- On success: navigate to a confirmation screen
- Confirmation shows: "Your property has been submitted for review! Our team will approve it within 24 hours."
- CTA buttons on confirmation: "View Dashboard" | "List Another Property"

**Edge Cases:**
- Network error on submit → show toast: "Submission failed. Please try again." — do not lose form data
- Supabase storage error → rollback: delete uploaded images if DB insert fails
- Double-click submit → disable button after first click (prevent duplicate submissions)

### 5.4 Pending Approval State

**Description:**
After submission, the listing is in a pending state until admin approves or rejects.

**Acceptance Criteria:**
- Listing appears in Owner Dashboard with status: "Pending Review" (yellow badge)
- Pending listings are NOT visible on public pages (`/properties`, homepage)
- Owner cannot edit a pending listing (must wait for approval or rejection)
- If rejected: owner sees rejection reason and can edit + resubmit

**Edge Cases:**
- Admin rejects → owner edits and resubmits → status resets to 'pending'
- Admin approves then owner edits → status resets to 'pending' (re-approval needed)

### 5.5 Add Property User Flow

```
User clicks "List Your Property" (or navigates to /add-property)
├── If not logged in → redirect to /login?returnUrl=/add-property
├── If logged in but role = tenant → show access denied message with option to update role
├── If logged in as owner/broker:
│   ├── Fills in property form (title, description, rent, etc.)
│   ├── Uploads 1–5 photos
│   ├── Clicks "Submit for Review"
│   ├── Sees loading state
│   ├── On success → confirmation screen
│   │   ├── "View Dashboard" → /dashboard
│   │   └── "List Another Property" → reset form
│   └── On error → toast notification, form data preserved
```


---

## 6. Login / Authentication (`/login`)

### 6.1 Login Page

**Description:**
Authentication page supporting signup and login for all user roles.

**Acceptance Criteria:**
- Two tabs/modes: "Login" and "Sign Up"
- Login: Email + Password fields + "Login" button
- Sign Up: Email + Password + Full Name + Phone + Role selection + "Create Account" button
- Role selection: Radio buttons — Tenant | Owner | Broker
- Google OAuth button: "Continue with Google" (role selected after OAuth if new user)
- "Forgot Password" link → triggers Supabase password reset email
- After successful login/signup → redirect to `returnUrl` query param or `/` (homepage)

**Edge Cases:**
- Invalid email format → inline validation error
- Password too short (<6 chars) → inline validation error
- Email already registered (signup) → show error: "This email is already registered. Please login."
- Wrong password (login) → show error: "Invalid email or password"
- Google OAuth user's first login → show role selection modal before completing signup
- Network error → show toast: "Connection error. Please try again."
- Rate limiting (too many attempts) → show: "Too many attempts. Please wait 60 seconds."

### 6.2 Auth User Flow

```
User clicks a protected action (add property, dashboard, etc.)
├── Redirected to /login?returnUrl=/add-property
├── Chooses Login or Sign Up tab
├── Login flow:
│   ├── Enters email + password
│   ├── Clicks Login
│   ├── On success → redirect to returnUrl
│   └── On error → show inline error
├── Sign Up flow:
│   ├── Enters name, email, password, phone, role
│   ├── Clicks Create Account
│   ├── Profile row created in DB (via Supabase trigger)
│   ├── On success → redirect to returnUrl
│   └── On error → show inline error
└── Google OAuth flow:
    ├── Clicks "Continue with Google"
    ├── Completes Google sign-in
    ├── If new user → role selection modal
    ├── Profile row created
    └── Redirect to returnUrl
```

---

## 7. Owner/Broker Dashboard (`/dashboard`)

### 7.1 Active Listings

**Description:**
A table/list of the user's approved (live) listings.

**Acceptance Criteria:**
- Shows all listings where `status = 'approved'` and `owner_id = current_user`
- Table columns: Title, Locality, Rent, Status (green "Active"), Date Listed, Actions
- Actions: Edit | Delete
- Click on row/title → navigates to `/properties/[id]`
- Badge showing total active count in tab/heading

**Edge Cases:**
- Zero active listings → show empty state: "No active listings yet. Your approved properties will appear here."

### 7.2 Pending Listings

**Description:**
A list of listings awaiting admin review.

**Acceptance Criteria:**
- Shows all listings where `status = 'pending'` and `owner_id = current_user`
- Table columns: Title, Locality, Rent, Status (yellow "Pending Review"), Date Submitted
- No edit/delete actions while pending (read-only)
- Badge showing pending count

**Edge Cases:**
- Zero pending listings → show: "No listings pending review."
- Listing pending for >48 hours → show subtle note: "Taking longer than usual? Contact support."

### 7.3 Rejected Listings

**Description:**
Listings that were rejected by admin, with reasons and ability to fix and resubmit.

**Acceptance Criteria:**
- Shows all listings where `status = 'rejected'` and `owner_id = current_user`
- Table columns: Title, Locality, Status (red "Rejected"), Rejection Reason, Actions
- Actions: Edit & Resubmit | Delete
- Rejection reason displayed in a collapsible note or tooltip
- "Edit & Resubmit" → opens pre-filled form, on submit resets status to 'pending'

**Edge Cases:**
- Zero rejected listings → hide this tab/section entirely (don't show empty rejected section)
- Rejection reason is empty → show: "No reason provided. Please contact support."

### 7.4 Edit Property

**Description:**
Ability to edit an existing listing.

**Acceptance Criteria:**
- Opens the same form as "Add Property" but pre-filled with existing data
- Can edit all fields including photos (add/remove)
- On submit: updates the property record
- If property was previously approved → status resets to 'pending' (requires re-approval)
- If property was rejected → status resets to 'pending'
- Shows confirmation: "Changes saved! Your listing will be reviewed again."

**Edge Cases:**
- Editing a pending listing → not allowed, show disabled state or message
- Removing all photos during edit → validation error: "At least 1 photo required"
- Changing WhatsApp number → allowed, no verification needed in MVP

### 7.5 Delete Listing

**Description:**
Ability to permanently remove a listing.

**Acceptance Criteria:**
- Delete button with confirmation dialog: "Are you sure? This will permanently remove your listing."
- Confirm + Cancel buttons in dialog
- On confirm: deletes property record and associated photos from storage
- Allowed on: active (approved) and rejected listings
- NOT allowed on: pending listings (must wait for review)
- After delete: show toast "Listing deleted successfully" and remove from table

**Edge Cases:**
- Delete fails (network) → show error toast, listing remains
- Rapid double-click delete → confirmation dialog prevents double action

### 7.6 Dashboard User Flow

```
Authenticated owner/broker visits /dashboard
├── Sees summary stats: X Active | Y Pending | Z Rejected
├── Default tab: Active Listings
├── Tabs: Active | Pending | Rejected
├── Active tab:
│   ├── Lists all approved properties
│   ├── Can click Edit → edit form
│   └── Can click Delete → confirmation → delete
├── Pending tab:
│   └── Lists pending properties (read-only)
└── Rejected tab:
    ├── Lists rejected properties with reasons
    ├── Can click Edit & Resubmit → edit form → submit
    └── Can click Delete → confirmation → delete
```


---

## 8. Admin Approval Panel (`/admin`)

### 8.1 Approve Listing

**Description:**
Admin can approve a pending listing, making it visible on public pages.

**Acceptance Criteria:**
- Admin sees all listings with `status = 'pending'`
- Each listing shown as an expanded card with: photos, title, description, rent, locality, owner info
- "Approve" button on each card
- On approve: sets `status = 'approved'`, sets `updated_at = now()`
- Optionally: admin can toggle "Mark as Verified" checkbox during approval
- After approve: listing appears on `/properties` and homepage

**Edge Cases:**
- Approve button clicked twice rapidly → disable after first click
- Listing deleted by owner while admin is reviewing → show error: "This listing no longer exists"
- Network failure on approve → show error toast, listing stays in pending state

### 8.2 Reject Listing

**Description:**
Admin can reject a listing with a reason.

**Acceptance Criteria:**
- "Reject" button on each pending listing card
- Clicking opens a dialog/modal:
  - Rejection reason (required): text area, 10–500 characters
  - Preset quick reasons: "Incomplete information", "Photos unclear", "Suspected fake listing", "Duplicate listing"
  - "Confirm Rejection" button
- On reject: sets `status = 'rejected'`, stores `rejection_reason`
- Owner sees the reason in their dashboard and can fix + resubmit

**Edge Cases:**
- Reject without reason → show validation: "Please provide a rejection reason"
- Very long reason (>500 chars) → truncate or show char limit warning
- Admin accidentally rejects → no undo in MVP (would need to re-approve if owner resubmits)

### 8.3 Mark as Verified

**Description:**
Admin can mark a listing as "Verified" to give it a trust badge.

**Acceptance Criteria:**
- Checkbox "Mark as Verified" shown during approval flow
- Can also be toggled independently for already-approved listings
- When verified: `is_verified = true` → green "Verified" badge appears on the property card and detail page
- Verification criteria (for admin reference, not enforced by system):
  - Photos look genuine
  - Description matches property type
  - Owner/broker is responsive (has prior approved listings)

**Edge Cases:**
- Owner edits a verified listing → verification resets to false (needs re-verification after re-approval)
- Admin verifies then later wants to unverify → can toggle off from approved listings view

### 8.4 Remove Fake Listing

**Description:**
Admin can forcefully remove a listing that is identified as fake or spam.

**Acceptance Criteria:**
- "Remove" button on any listing (pending or approved)
- Opens confirmation: "This will permanently delete this listing. This action cannot be undone."
- On confirm: hard-deletes the listing and associated photos
- Different from "Reject" — reject allows resubmission, remove is permanent deletion
- Optionally shows a note to owner (stored as rejection_reason with status 'removed')

**Edge Cases:**
- Removing a listing that has active reports → clear the reports as well
- Removing an approved listing → immediately disappears from public pages

### 8.5 Admin Panel Tabs/Filters

**Acceptance Criteria:**
- Tabs: Pending (default) | Approved | Rejected
- Count badge on each tab showing number of listings
- Search within admin panel (by title or owner name)
- Sort by: newest submissions first (default)

### 8.6 Admin User Flow

```
Admin visits /admin
├── Sees tab bar: Pending (X) | Approved (Y) | Rejected (Z)
├── Default: Pending tab
├── For each pending listing:
│   ├── Reviews photos, title, description, rent, locality, owner info
│   ├── Clicks "Approve"
│   │   ├── Optionally checks "Mark as Verified"
│   │   └── Listing moves to Approved tab, appears on public pages
│   ├── Clicks "Reject"
│   │   ├── Enters/selects rejection reason
│   │   └── Listing moves to Rejected tab, owner notified via dashboard
│   └── Clicks "Remove" (for spam/fake)
│       └── Listing permanently deleted
├── Approved tab:
│   ├── Can toggle verified status
│   └── Can remove fake listings
└── Rejected tab:
    └── View-only (owner can resubmit, it will appear in Pending again)
```


---

## 9. Technical Requirements

### 9.1 Authentication (Supabase Auth)

**Acceptance Criteria:**
- Email/password authentication with Supabase Auth
- Google OAuth provider configured
- Password reset via email link
- Session management with automatic token refresh
- Auth state persisted across page reloads
- Protected routes redirect to `/login` if unauthenticated
- Role-based access: Owner/Broker for `/add-property` and `/dashboard`, Admin for `/admin`
- Auth middleware runs on every request for protected routes

**Edge Cases:**
- Expired session → automatic redirect to login with return URL
- Concurrent sessions (multiple tabs) → all tabs stay in sync
- User deleted from Supabase → next request fails gracefully, redirect to login

### 9.2 Supabase Storage

**Acceptance Criteria:**
- Bucket: `property-photos` (public read, authenticated write)
- Upload path: `{user_id}/{property_id}/{filename}`
- Accepted MIME types: image/jpeg, image/png, image/webp
- Max file size: 5MB per file enforced at storage policy level
- Public URLs used for displaying images (no signed URLs needed for reads)
- On property delete: cascade delete all associated images from storage

**Edge Cases:**
- Storage quota exceeded → show user-friendly error
- Orphaned images (upload succeeded but DB insert failed) → cleanup job (post-MVP)
- Concurrent uploads → each file uploaded independently, partial success allowed

### 9.3 Responsive UI

**Acceptance Criteria:**
- Mobile-first design approach
- Breakpoints: 375px (mobile), 640px (sm), 768px (md/tablet), 1024px (lg), 1280px (xl/desktop)
- All pages functional and readable at 375px width
- Touch targets: minimum 44x44px on mobile
- No horizontal scroll on any viewport
- Images and cards scale appropriately
- Navigation collapses to hamburger/sheet on mobile
- Contact buttons sticky on mobile detail page

**Edge Cases:**
- Very small screens (320px) → still functional, may have tighter spacing
- Landscape mobile → adapts gracefully
- Tablet in portrait vs landscape → grid adjusts (2 col portrait, 3 col landscape)

### 9.4 Error States

**Acceptance Criteria:**
- Every data-fetching page has an error state UI
- Error states show: friendly message + retry button
- Toast notifications for action failures (submit, delete, approve/reject)
- Network offline detection → banner: "You're offline. Some features may not work."
- 404 page for non-existent property IDs
- 403 handling: unauthorized access shows "Access Denied" with redirect options
- Form submission errors preserve all form data (user doesn't lose input)

**Edge Cases:**
- Intermittent network → retry logic with exponential backoff (for mutations)
- Supabase service down → generic error page: "Something went wrong. Please try again later."

### 9.5 Loading States

**Acceptance Criteria:**
- Skeleton loaders for:
  - Property cards grid (rectangular placeholders)
  - Property detail page (image placeholder + text lines)
  - Dashboard table (row placeholders)
  - Admin panel cards
- Button loading states: spinner + disabled + text change ("Submitting...")
- Page-level loading: progress bar or spinner during route transitions
- Image loading: blur-up placeholder or gray background until loaded

**Edge Cases:**
- Slow 3G connections → skeleton remains visible until data arrives (no flash of empty content)
- Extremely slow response (>10s) → show additional message: "This is taking longer than usual..."

### 9.6 Empty States

**Acceptance Criteria:**
- Every list/grid view has a designed empty state (not just blank space)
- Empty state includes: illustration/icon + message + actionable CTA

| Page/Section | Empty State Message | CTA |
|---|---|---|
| Homepage Featured | "New listings coming soon!" | "List Your Property" |
| Property Listing (no results) | "No properties match your filters" | "Clear Filters" |
| Property Listing (no data) | "No properties listed yet" | "Be the first — List Your Property" |
| Dashboard Active | "No active listings" | "Add Your First Property" |
| Dashboard Pending | "No pending listings" | — |
| Dashboard Rejected | Hidden entirely if empty | — |
| Admin Pending | "All caught up! No pending listings." | — |

**Edge Cases:**
- Filters applied but zero results → differentiate from "no data at all" — show filter-specific message
- New user first visit to dashboard → welcoming empty state with getting-started guidance

---

## 10. MVP Scope Exclusions

The following are explicitly **NOT** in the MVP:

- ❌ Payment processing / rent collection
- ❌ Subscription or premium plans
- ❌ AI-based duplicate detection
- ❌ Mobile app (React Native / Flutter)
- ❌ Advanced analytics or reporting dashboard
- ❌ In-app chat or messaging system
- ❌ Rent agreement generation
- ❌ Multi-language support (Hindi, etc.)
- ❌ Multi-city support (architecture allows it, but UI is Alwar-only)
- ❌ Email notifications (no transactional emails in MVP)
- ❌ SMS verification of phone numbers
- ❌ Map/location picker for property address
- ❌ Virtual tour or video upload
- ❌ Saved/bookmarked properties
- ❌ User reviews or ratings

---

## 11. Database Schema (Reference)

### Table: `profiles`
- id (uuid, PK, references auth.users)
- full_name (text, required)
- role (enum: tenant, owner, broker, admin)
- phone (text)
- created_at (timestamptz)

### Table: `properties`
- id (uuid, PK)
- owner_id (uuid, FK → profiles)
- title (text, required)
- description (text, required)
- rent (integer, required)
- deposit (integer, required)
- property_type (enum: 1bhk, 2bhk, 3bhk, shop, pg)
- furnishing (enum: furnished, semi-furnished, unfurnished)
- locality (text, required)
- city (text, default 'Alwar')
- floor (integer, nullable)
- parking (boolean, default false)
- amenities (text[], nullable)
- photos (text[], URLs)
- whatsapp_number (text, required)
- contact_number (text, nullable)
- listed_by (enum: owner, broker)
- status (enum: pending, approved, rejected)
- is_verified (boolean, default false)
- rejection_reason (text, nullable)
- created_at (timestamptz)
- updated_at (timestamptz)

### Table: `reports`
- id (uuid, PK)
- property_id (uuid, FK → properties)
- reason (text, required)
- details (text, nullable)
- created_at (timestamptz)
