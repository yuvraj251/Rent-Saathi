export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Listings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your property listings — view status, edit, or delete.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            Dashboard with active, pending, and rejected listings will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}
