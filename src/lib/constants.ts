export const SITE_NAME = "RentSaathi";
export const SITE_TAGLINE = "Your trusted rental companion in Alwar";
export const SITE_DESCRIPTION =
  "Find verified rental properties in Alwar. Contact owners directly on WhatsApp. No spam. No fake listings.";

export const CITY = "Alwar";
export const STATE = "Rajasthan";

export const PROPERTY_TYPES = [
  { value: "1bhk", label: "1 BHK" },
  { value: "2bhk", label: "2 BHK" },
  { value: "3bhk", label: "3 BHK" },
  { value: "shop", label: "Shop" },
  { value: "pg", label: "PG" },
] as const;

export const FURNISHING_OPTIONS = [
  { value: "furnished", label: "Furnished" },
  { value: "semi-furnished", label: "Semi-Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
] as const;

export const LOCALITIES = [
  "Rajgarh Road",
  "Malviya Nagar",
  "Scheme 10",
  "Hope Circus",
  "Manu Marg",
  "Alwar Gate",
  "Kala Kuan",
  "Jai Hind Market",
] as const;

export const AMENITIES = [
  "Parking",
  "Water Supply",
  "Power Backup",
  "Lift",
  "Balcony",
  "Kitchen",
  "Attached Bathroom",
  "WiFi Ready",
] as const;

export const BUDGET_RANGES = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 – ₹15,000", min: 10000, max: 15000 },
  { label: "₹15,000+", min: 15000, max: 999999 },
] as const;

export const NAV_LINKS = [
  { href: "/properties", label: "Properties" },
  { href: "/add-property", label: "List Property" },
] as const;

export const PROTECTED_ROUTES = ["/add-property", "/dashboard", "/admin"];
export const OWNER_ROUTES = ["/add-property", "/dashboard"];
export const ADMIN_ROUTES = ["/admin"];
