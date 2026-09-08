type ErrorAlertProps = {
  message: string | null;
};

export default function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-card backdrop-blur-md">
      <div className="font-semibold text-red-100">Something needs attention</div>
      <div className="mt-1 leading-relaxed text-red-200/90">{message}</div>
    </div>
  );
}
