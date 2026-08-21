import { isRouteErrorResponse, useRouteError } from "react-router";

const RouteError = () => {
  const error = useRouteError();

  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : null;

  return (
    <div className="flex min-h-screen items-center px-5">
      <div className="mx-auto w-full max-w-md">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-hit">
          Something broke
        </p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
          This page didn't load
        </h1>
        <p className="mt-3 text-chalk-dim">
          Opening the league again usually clears it.
        </p>

        {detail && (
          <p className="mt-5 border-l-2 border-line pl-3 font-mono text-xs text-chalk-dim">
            {detail}
          </p>
        )}

        {/* A full page load rather than a client-side link: the app state that
            produced the crash is discarded along with it. */}
        <a
          href="/"
          className="mt-8 inline-block border-b border-gold pb-0.5 text-sm font-semibold text-gold"
        >
          Back to your leagues
        </a>
      </div>
    </div>
  );
};

export default RouteError;
