type LoadingStateProps = {
  label?: string;
};

export default function LoadingState({ label = "Working on it..." }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-100 shadow-soft backdrop-blur">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200/30 border-t-emerald-300" />
      <span>{label}</span>
    </div>
  );
}
