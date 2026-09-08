type LoadingStateProps = {
  label?: string;
};

export default function LoadingState({ label = "Working on it..." }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200 shadow-glow backdrop-blur-md">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
      <span>{label}</span>
    </div>
  );
}
