export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-neutral-400">
          By using Elytracloud you agree to our managed hosting terms. We operate on a monthly subscription basis and
          provide best-effort uptime, security, and support for your WordPress environment.
        </p>
        <p className="text-neutral-400">
          Questions about these terms? Email
          {" "}
          <a
            href="mailto:hello@elytracloud.com"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            hello@elytracloud.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
