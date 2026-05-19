import Link from "next/link";
import { Search, Building2, Shield, MessageCircle, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPES, LOCALITIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-background to-emerald-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Verified Rental Properties in Alwar
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Find flats, houses, shops and offices directly from owners and trusted brokers.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/properties">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Properties
                </Button>
              </Link>
              <Link href="/add-property">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Building2 className="mr-2 h-5 w-5" />
                  List Your Property — Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters — Property Types */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          What are you looking for?
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {PROPERTY_TYPES.map((type) => (
            <Link
              key={type.value}
              href={`/properties?type=${type.value}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            >
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {type.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties Placeholder */}
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Featured Rentals in Alwar
            </h2>
            <Link
              href="/properties"
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-background p-6 text-center"
              >
                <div className="mx-auto h-32 w-full rounded-lg bg-muted" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Property listing card will appear here
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Localities */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Popular Localities
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {LOCALITIES.map((locality) => (
            <Link
              key={locality}
              href={`/properties?locality=${encodeURIComponent(locality)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:bg-primary/5"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {locality}
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
            Why Trust RentSaathi?
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center">
              <Shield className="h-10 w-10 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Admin Verified</h3>
              <p className="text-xs text-muted-foreground">
                Every listing is reviewed before going live
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center">
              <MessageCircle className="h-10 w-10 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">WhatsApp Contact</h3>
              <p className="text-xs text-muted-foreground">
                One tap to message owners directly
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center">
              <CheckCircle className="h-10 w-10 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">No Fake Listings</h3>
              <p className="text-xs text-muted-foreground">
                Spam and fake entries are rejected
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-6 text-center">
              <MapPin className="h-10 w-10 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Local Alwar Focus</h3>
              <p className="text-xs text-muted-foreground">
                Built specifically for Alwar&apos;s rental market
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-primary/5 border border-primary/20 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Own a property in Alwar? List it for free!
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Reach verified tenants without paying brokerage. Simple form, quick approval, direct WhatsApp enquiries.
          </p>
          <div className="mt-6">
            <Link href="/add-property">
              <Button size="lg">List Your Property</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
