export const ErrorState = ({ message }: { message: string }) => (
  <div className="border-l-2 border-hit bg-raised px-5 py-6">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hit">
      Can't load this
    </p>
    <p className="mt-2 text-chalk">{message}</p>
  </div>
);

export const TruncationNotice = () => (
  <p className="mb-6 border-l-2 border-gold bg-raised px-4 py-3 text-sm text-chalk-dim">
    <span className="text-chalk">This league is too big to load in full.</span>{" "}
    Showing the top 150 managers by overall rank.
  </p>
);
