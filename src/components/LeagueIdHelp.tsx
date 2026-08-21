import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const STEPS = [
  {
    title: "Sign in to FPL",
    body: "Open fantasy.premierleague.com and sign in to your account.",
  },
  {
    title: "Open Leagues",
    body: "From the top menu, go to Leagues.",
  },
  {
    title: "Pick your mini-league",
    body: "Click the league you want to track. Your standings open.",
  },
  {
    title: "Copy the number from the address bar",
    body: "Your league ID is the number straight after /leagues/. Copy the whole address if it's easier — this page reads the ID out of it.",
  },
];

const LeagueIdHelp = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={false}
        className="mt-3 text-sm text-chalk-dim underline underline-offset-4 transition-colors hover:text-gold"
      >
        Where do I find my league ID?
      </button>
    );
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="mt-4 border-l-2 border-gold bg-raised p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="tnum font-mono text-xs uppercase tracking-[0.18em] text-gold">
          Step {step + 1} / {STEPS.length}
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            setOpen(false);
            setStep(0);
          }}
          className="p-1 text-chalk-dim transition-colors hover:text-chalk"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <h3 className="font-semibold text-chalk">{current.title}</h3>
      <p className="mt-1 text-sm text-chalk-dim">{current.body}</p>

      {isLast && (
        <p className="mt-3 overflow-x-auto whitespace-nowrap border border-line bg-pitch px-3 py-2 font-mono text-xs text-chalk-dim">
          premierleague.com/leagues/
          <span className="font-semibold text-gold">1863884</span>
          /standings/c
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="flex items-center gap-1 border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-chalk-dim transition-colors hover:text-chalk disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setStep(0);
            }}
            className="border border-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold hover:text-pitch"
          >
            Got it
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="flex items-center gap-1 border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-chalk transition-colors hover:border-gold hover:text-gold"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LeagueIdHelp;
