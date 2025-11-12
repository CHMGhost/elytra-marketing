export default function RefundPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Refund Policy</h1>
        <p className="text-neutral-400">
          Elytracloud offers a 30-day money-back guarantee for new subscriptions. If our managed WordPress platform is
          not the right fit, let us know within the first month and we will refund your first payment in full.
        </p>
        <p className="text-neutral-400">
          To request a refund, email
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
