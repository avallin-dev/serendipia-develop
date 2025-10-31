export default function Page() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-secondary">404</h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
            Something&apos;s missing.
          </p>
          <p className="text-gray mb-4 text-lg font-light">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page.{' '}
          </p>
          <a
            href="#"
            className="my-4 inline-flex rounded-lg bg-secondary px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-primary"
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}
