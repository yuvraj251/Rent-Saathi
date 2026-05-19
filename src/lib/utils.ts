import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRent(amount: number): string {
  if (amount === 0) return "Contact for Rent";
  return `₹${amount.toLocaleString("en-IN")}/mo`;
}

export function buildWhatsAppURL(phone: string, propertyTitle: string): string {
  const message = encodeURIComponent(
    `Hi, I'm interested in your property "${propertyTitle}" listed on RentSaathi.`
  );
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  return `https://wa.me/91${cleanPhone}?text=${message}`;
}

export function buildCallURL(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  return `tel:+91${cleanPhone}`;
}
