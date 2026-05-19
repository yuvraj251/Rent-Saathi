export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="mx-auto w-full max-w-md px-4">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-center">
            Welcome to RentSaathi
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Login or create an account to list and manage properties.
          </p>
          <div className="mt-8 rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">
              Login / Signup form will appear here.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
