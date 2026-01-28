import { SpinnerIcon } from "./Icon";

interface LoadingProgressProps {
  stage:
    | "profile"
    | "repositories"
    | "languages"
    | "contributions"
    | "complete";
  currentStep?: number;
  totalSteps?: number;
}

const stages = [
  { key: "profile", label: "Fetching profile data" },
  { key: "repositories", label: "Loading repositories" },
  { key: "languages", label: "Analyzing languages" },
  { key: "contributions", label: "Loading contributions" },
] as const;

export default function LoadingProgress({
  stage,
  currentStep,
  totalSteps,
}: LoadingProgressProps) {
  const currentStageIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-center gap-3">
        <SpinnerIcon className="h-6 w-6" />
        <p className="text-foreground/80 font-medium">
          {stage === "complete"
            ? "Complete!"
            : stages[currentStageIndex]?.label}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-border/30 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{
            width: `${((currentStageIndex + 1) / stages.length) * 100}%`,
          }}
        />
      </div>

      {/* Step counter for language fetching */}
      {stage === "languages" &&
        currentStep !== undefined &&
        totalSteps !== undefined && (
          <p className="text-sm text-muted text-center">
            Analyzing {currentStep} of {totalSteps} repositories
          </p>
        )}

      {/* Stage checklist */}
      <div className="space-y-2">
        {stages.map((s, index) => {
          const isComplete = index < currentStageIndex || stage === "complete";
          const isCurrent = index === currentStageIndex && stage !== "complete";

          return (
            <div
              key={s.key}
              className={`flex items-center gap-2 text-sm transition-all ${
                isComplete
                  ? "text-primary"
                  : isCurrent
                    ? "text-foreground"
                    : "text-muted"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isComplete
                    ? "border-primary bg-primary"
                    : isCurrent
                      ? "border-primary"
                      : "border-border"
                }`}
              >
                {isComplete && (
                  <svg
                    className="w-3 h-3 text-background"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
