export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-neutral-400">
          Elytracloud respects your privacy. We collect only the information required to provision and maintain your
          WordPress environment. We never sell or share personal data with third parties.
        </p>
        <p className="text-neutral-400">
          Questions? Email
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