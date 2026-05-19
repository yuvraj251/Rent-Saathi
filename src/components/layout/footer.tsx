import Link from "next/link";
import { Home, MapPin } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-foreground">{SITE_NAME}</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">{SITE_TAGLINE}</p>
            <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>Made for Alwar, Rajasthan</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/properties"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/add-property"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  List Your Property
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login / Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Why RentSaathi?</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Admin-verified listings</li>
              <li>Direct owner contact via WhatsApp</li>
              <li>No fake listings</li>
              <li>100% free for owners</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
