export default function PropertiesPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Rental Properties in Alwar
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse verified rental listings from owners and brokers.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Property listings with filters will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}
