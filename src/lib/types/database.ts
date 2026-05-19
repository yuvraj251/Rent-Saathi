export type UserRole = "tenant" | "owner" | "broker" | "admin";
export type PropertyType = "1bhk" | "2bhk" | "3bhk" | "shop" | "pg";
export type FurnishingStatus = "furnished" | "semi-furnished" | "unfurnished";
export type ListingStatus = "pending" | "approved" | "rejected";
export type ListerType = "owner" | "broker";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  rent: number;
  deposit: number;
  property_type: PropertyType;
  furnishing: FurnishingStatus;
  locality: string;
  city: string;
  floor: number | null;
  parking: boolean;
  amenities: string[] | null;
  photos: string[];
  whatsapp_number: string;
  contact_number: string | null;
  listed_by: ListerType;
  status: ListingStatus;
  is_verified: boolean;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  property_id: string;
  reason: string;
  details: string | null;
  created_at: string;
}
